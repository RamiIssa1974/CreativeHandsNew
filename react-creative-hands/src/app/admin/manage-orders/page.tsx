'use client';
import React, { useEffect, useState } from 'react';
import { fetchOrders, updateOrderStatus } from '@/services/orderService';
import { getStatusName, getStatusId, getOrderTotalPrice } from '@/utils/Helpers';
import '@/app/styles/ManageOrdersPage.css';
import { OrderModel } from '@/data/OrdelModel';
import Link from 'next/link';
import { AiOutlineArrowRight } from 'react-icons/ai';

const statusOptions = ['Cart', 'Accepted', 'Prepared', 'Sent', 'Paid', 'Canceled', 'Closed'];


const ManageOrders = () => {
    const [orders, setOrders] = useState<OrderModel[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [statusChanges, setStatusChanges] = useState<{ [orderId: number]: number }>({});
    const [filteredOrders, setFilteredOrders] = useState<OrderModel[]>([]);
    const [searchText, setSearchText] = useState('');
    const [selectedStatus, setSelectedStatus] = useState(0); 
    const [sortField, setSortField] = useState<string>('id');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const request = {
                    orderId: 0,
                    customerId: 0,
                    customerName: '',
                    customerTel: '',
                    statusId: 1, // Cart as default
                };

                const data = await fetchOrders(request);
                setOrders(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadOrders();
    }, []);

    useEffect(() => {
        const filtered = orders.filter((order) => {
            const search = searchText.toLowerCase();

            return (
                order.customer?.name.toLowerCase().includes(search) ||
                order.customer?.phone.toLowerCase().includes(search) ||
                order.customer?.address.toLowerCase().includes(search) ||
                new Date(order.createDate + 'Z').toLocaleDateString('en-GB').includes(search)
            );
        });

        setFilteredOrders(filtered);
    }, [searchText, orders]);

    useEffect(() => {
        const sortedOrders = [...orders].sort((a, b) => {
            let aField: any;
            let bField: any;

            switch (sortField) {
                case 'id':
                    aField = a.id;
                    bField = b.id;
                    break;
                case 'customer':
                    aField = a.customer?.name?.toLowerCase() || '';
                    bField = b.customer?.name?.toLowerCase() || '';
                    break;
                case 'date':
                    aField = new Date(a.createDate).getTime();
                    bField = new Date(b.createDate).getTime();
                    break;
                case 'status':
                    aField = a.statusId;
                    bField = b.statusId;
                    break;
                default:
                    return 0;
            }

            if (aField < bField) return sortDirection === 'asc' ? -1 : 1;
            if (aField > bField) return sortDirection === 'asc' ? 1 : -1;
            return 0;
        });

        console.log('Sorted Orders:', sortedOrders); //Check the data here

        setFilteredOrders(sortedOrders);
    }, [sortField, sortDirection, orders]);

    const handleSort = (field: string) => {
        if (sortField === field) {
            // If clicking the same field ➔ toggle direction
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // Change field ➔ default to ascending
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const handleStatusFilterChange = async (statusId: number) => {
        setSelectedStatus(statusId);

        try {
            setLoading(true);

            const request = {
                orderId: 0,
                customerId: 0,
                customerName: '',
                customerTel: '',
                statusId: statusId === 0 ? 0 : statusId, // 0 means no filter
            };

            const data = await fetchOrders(request);
            setOrders(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveStatus = async (orderId: number) => {
        const newStatusId = statusChanges[orderId];

        if (newStatusId === undefined) {
            alert('No changes to save.');
            return;
        }

        try {
            await updateOrderStatus(orderId, newStatusId);

            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, statusId: newStatusId } : order
                )
            );

            // Clear the change after saving
            setStatusChanges((prev) => {
                const updated = { ...prev };
                delete updated[orderId];
                return updated;
            });

            alert('Order status saved!');
        } catch (err: any) {
            alert('Failed to save order status');
        }
    };

    
    if (loading) {
        return (
            <div className="page-loading-container">
                <div className="spinner"></div>
                <p>جاري تحميل الطلبات...</p>
            </div>
        );
    }
    if (error) return <p>Error: {error}</p>;

    return (
        <div>
            <div className="filters-container">
                {/* Search box */}
                <input
                    type="text"
                    placeholder="Search by customer, phone, address, or date"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="filter-input"
                />

                {/* Status dropdown */}
                <select
                    value={selectedStatus}
                    onChange={(e) => handleStatusFilterChange(Number(e.target.value))}
                    className="filter-select"
                >
                    <option value={0}>All Statuses</option>
                    {statusOptions.map((status) => (
                        <option key={status} value={getStatusId(status)}>
                            {status}
                        </option>
                    ))}
                </select>
            </div>

            <div className="desktop-table">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th onClick={() => handleSort('id')}>
                                ID {sortField === 'id' && (sortDirection === 'asc' ? '⬆️' : '⬇️')}
                            </th>
                            <th onClick={() => handleSort('customer')}>
                                Customer {sortField === 'customer' && (sortDirection === 'asc' ? '⬆️' : '⬇️')}
                            </th>
                            <th onClick={() => handleSort('date')}>
                                Date {sortField === 'date' && (sortDirection === 'asc' ? '⬆️' : '⬇️')}
                            </th>
                            <th onClick={() => handleSort('status')}>
                                Status {sortField === 'status' && (sortDirection === 'asc' ? '⬆️' : '⬇️')}
                            </th>
                            <th>Change Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer?.name}</td>
                                <td>{new Date(order.createDate + 'Z').toLocaleDateString('en-GB')}</td>
                                <td>{getStatusName(order.statusId)}</td>
                                <td>
                                    <select
                                        value={statusChanges[order.id] ?? order.statusId}
                                        onChange={(e) => {
                                            const newStatusId = Number(e.target.value);
                                            setStatusChanges((prev) => ({
                                                ...prev,
                                                [order.id]: newStatusId,
                                            }));
                                        }}
                                    >
                                        {statusOptions.map((status) => (
                                            <option key={status} value={getStatusId(status)}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={() => handleSaveStatus(order.id)}
                                        disabled={statusChanges[order.id] === undefined || statusChanges[order.id] === order.statusId}
                                    >
                                        💾
                                    </button>
                                </td>
                                <td>
                                    <Link href={`/orders/order-details/${order.id}`}>
                                        View Details ➡️
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mobile-cards">
                {filteredOrders.map((order) => (
                    <div key={order.id} className="order-card">
                        <h3>Order #{order.id}</h3>
                        <p><strong>Customer:</strong> {order.customer?.name}</p>
                        <p><strong>Date:</strong> {new Date(order.createDate + 'Z').toLocaleDateString('en-GB')}</p>
                        <p><strong>Status:</strong> {getStatusName(order.statusId)}</p>
                        <p><strong>Total:</strong> {getOrderTotalPrice(order.orderItems)} ₪</p>

                        <div className="order-card-actions">
                            <select
                                value={statusChanges[order.id] ?? order.statusId}
                                onChange={(e) => {
                                    const newStatusId = Number(e.target.value);
                                    setStatusChanges((prev) => ({
                                        ...prev,
                                        [order.id]: newStatusId,
                                    }));
                                }}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={getStatusId(status)}>
                                        {status}
                                    </option>
                                ))}
                            </select>

                            <button
                                onClick={() => handleSaveStatus(order.id)}
                                disabled={statusChanges[order.id] === undefined || statusChanges[order.id] === order.statusId}
                            >
                                💾
                            </button>

                            <Link href={`/orders/order-details/${order.id}`}>
                                View Details ➡️
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ManageOrders;

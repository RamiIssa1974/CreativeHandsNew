'use client';

import React, { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import './Menu.css';

interface SubMenuItem {
	id: number;
	name: string;
	href: string;
	icon?: ReactNode;
}

interface MenuItem {
	name: string;
	href?: string;
	submenu?: SubMenuItem[];
	icon?: ReactNode;
}

interface MenuProps {
	items: MenuItem[];
}

const Menu: React.FC<MenuProps> = ({ items }) => {
	const [isMobile, setIsMobile] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

	useEffect(() => {
		const checkMobile = () => {
			setIsMobile(window.innerWidth <= 768);
		};

		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	}, []);

	const toggleMenu = () => setMenuOpen(!menuOpen);

	const toggleSubmenu = (menuName: string) => {
		setOpenSubmenu((prev) => (prev === menuName ? null : menuName));
	};

	return (
		<nav className="menu">
			{isMobile ? (
				<>
					<button className="hamburger" onClick={toggleMenu}>☰</button>
					<ul className={`menu-list mobile ${menuOpen ? 'open' : ''}`}>
						{items.map((item, index) => (
							<li key={index} className="menu-item">
								{item.submenu ? (
									<>
										<button
											className="menu-button"
											onClick={() => toggleSubmenu(item.name)}
										>
											{item.icon && <span className="menu-icon">{item.icon}</span>}
											<span>{item.name}</span>
										</button>

										{openSubmenu === item.name && (
											<ul className="submenu-list">
												{item.submenu.map((subItem) => (
													<li key={subItem.id} className="submenu-item">
														<Link
															href={subItem.href}
															onClick={() => {
																setMenuOpen(false);
																setOpenSubmenu(null);
															}}
														>
															{subItem.icon && (
																<span className="menu-icon">{subItem.icon}</span>
															)}
															<span>{subItem.name}</span>
														</Link>
													</li>
												))}
											</ul>
										)}
									</>
								) : (
									<Link
										href={item.href || '#'}
										className="menu-link"
										onClick={() => setMenuOpen(false)}
									>
										{item.icon && <span className="menu-icon">{item.icon}</span>}
										<span>{item.name}</span>
									</Link>
								)}
							</li>
						))}
					</ul>
				</>
			) : (
				<ul className="menu-list desktop">
					{items.map((item, index) => (
						<li key={index} className="menu-item">
							{item.submenu ? (
								<>
									<button
										className="menu-button"
										onClick={() => toggleSubmenu(item.name)}
									>
										{item.icon && <span className="menu-icon">{item.icon}</span>}
										<span>{item.name}</span>
									</button>

									{openSubmenu === item.name && (
										<ul className="submenu-list">
											{item.submenu.map((subItem) => (
												<li key={subItem.id} className="submenu-item">
													<Link href={subItem.href}>
														{subItem.icon && (
															<span className="menu-icon">{subItem.icon}</span>
														)}
														<span>{subItem.name}</span>
													</Link>
												</li>
											))}
										</ul>
									)}
								</>
							) : (
								<Link href={item.href || '#'} className="menu-link">
									{item.icon && <span className="menu-icon">{item.icon}</span>}
									<span>{item.name}</span>
								</Link>
							)}
						</li>
					))}
				</ul>
			)}
		</nav>
	);
};

export default Menu;

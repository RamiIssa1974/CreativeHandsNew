import { ProductVariationModel } from '../data/ProductVariationModel';
import React, { useState } from 'react';
import '../app/styles/VariationModal.css';
interface VariationModalProps {
    variations: ProductVariationModel[];
    onSelect: (variation: ProductVariationModel) => void;
    onClose: () => void;
}


const VariationModal: React.FC<VariationModalProps> = ({ variations, onSelect, onClose }) => {
    const [selectedVariationId, setSelectedVariationId] = useState<number | null>(null);
    const confirmSelection = () => {
        const selected = variations.find((v) => v.Id === selectedVariationId);
        if (selected) {
            onSelect(selected);
        } else {
            alert('الرجاء اختيار إمكانية قبل المتابعة');
        }
    };

    return (
        <div className="variation-modal-overlay">
            <div className="variation-modal-content">
                <h3>اختر إمكانية السعر</h3>

                <div className="variation-list">
                    {variations.map((variation) => (
                        <div
                            key={variation.Id}
                            className={`variation-card ${selectedVariationId === variation.Id ? 'selected' : ''}`}
                            onClick={() => setSelectedVariationId(variation.Id)}
                        >
                            <input
                                type="radio"
                                checked={selectedVariationId === variation.Id}
                                readOnly
                            />
                            <div className="variation-details">
                                <div className="variation-description">{variation.Description}</div>
                                 { " - " } 
                                <div className="variation-price">{variation.Price} ₪</div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="modal-actions">
                    <button className="confirm-btn" onClick={confirmSelection}>تأكيد الإختيار</button>
                    <button className="cancel-btn" onClick={onClose}>إلغاء</button>
                </div>
            </div>
        </div>
    );
};

export default VariationModal;

import React from 'react';
import { FaClock, FaBox, FaTruck, FaCheckCircle } from 'react-icons/fa';

const OrderTimeline = ({ status }) => {
    const steps = [
        { id: 'pending', label: 'Order Pending', icon: FaClock },
        { id: 'processing', label: 'Processing', icon: FaBox },
        { id: 'shipping', label: 'On the Way', icon: FaTruck },
        { id: 'delivered', label: 'Delivered', icon: FaCheckCircle }
    ];

    const currentStepIndex = steps.findIndex(step => step.id === (status || 'pending'));

    return (
        <div className="py-4">
            <div className="relative flex justify-between">
                {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isActive = index <= currentStepIndex;
                    const isCompleted = index < currentStepIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center">
                            <div 
                                className={`w-8 h-8 rounded-full flex items-center justify-center 
                                    ${isActive ? 'bg-themegreen text-white' : 'bg-gray-200 text-gray-400'}
                                    ${isCompleted ? 'bg-themegreen text-white' : ''}`}
                            >
                                <StepIcon className="w-4 h-4" />
                            </div>
                            <p className={`mt-2 text-xs font-medium ${isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}

                {/* Progress Bar */}
                <div className="absolute top-4 left-0 h-[2px] bg-gray-200 w-full -z-10">
                    <div 
                        className="h-full transition-all duration-500 bg-themegreen"
                        style={{ 
                            width: `${(currentStepIndex / (steps.length - 1)) * 100}%`,
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderTimeline;
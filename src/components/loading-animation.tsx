import React from 'react';

function LoadingAnimation() {
    return (
        <div className="flex items-center justify-center h-24">
            <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-accent rounded-full animate-bounce"/>
                <div className="w-4 h-4 bg-accent rounded-full animate-bounce delay-75"/>
                <div className="w-4 h-4 bg-accent rounded-full animate-bounce delay-150"/>
            </div>
        </div>
    );
}

export default LoadingAnimation;

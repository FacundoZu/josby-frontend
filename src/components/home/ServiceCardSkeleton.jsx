const ServiceCardSkeleton = () => {
    return (
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden max-w-sm animate-pulse">
            <div className="relative h-48 w-full bg-gray-200">
                <div className="absolute top-3 left-3 bg-gray-300 h-6 w-24 rounded-full"></div>
            </div>

            <div className="p-4">
                <div className="h-6 bg-gray-200 rounded mb-2 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded mb-3 w-1/2"></div>

                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded mb-1 w-2/3"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>

                <div className="mb-4 space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>

                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-6 bg-gray-200 rounded mb-1 w-20"></div>
                        <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-9 bg-gray-200 rounded-lg w-20"></div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCardSkeleton;

export default function FreelancerCardSkeleton() {
    return (
        <div className="flex flex-col justify-between bg-white p-4 rounded-2xl shadow-md border border-gray-100 animate-pulse">
            <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>

            <div className="flex items-center gap-2 mt-3">
                <div className="w-4 h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
            </div>

            <div className="h-4 bg-gray-200 rounded w-2/3 my-2"></div>

            <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded w-full"></div>
                <div className="h-3 bg-gray-200 rounded w-5/6"></div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
                <div className="h-6 bg-gray-200 rounded-full w-16"></div>
                <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                <div className="h-6 bg-gray-200 rounded-full w-14"></div>
            </div>

            <div className="h-10 bg-gray-200 rounded-lg w-28 self-end mt-6"></div>
        </div>
    );
}

'use client'
interface WelcomeHeaderProps {
    userName: string;
    userEmail: string;
}

export const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ userName, userEmail }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Test Products Faster Than Your Competition</h1>
                    <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={() => console.log("Generate product clicked")}
                >
                    Generate Product
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-16">
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="bg-blue-100 dark:bg-blue-900 p-3 rounded-full">
                        <svg className="w-6 h-6 text-blue-500 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold dark:text-white">Products Tested</h2>
                        <p className="text-2xl font-bold dark:text-white">15</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="bg-green-100 dark:bg-green-900 p-3 rounded-full">
                        <svg className="w-6 h-6 text-green-500 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold dark:text-white">Time Saved</h2>
                        <p className="text-2xl font-bold dark:text-white">24h</p>
                    </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
                    <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-full">
                        <svg className="w-6 h-6 text-yellow-500 dark:text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold dark:text-white">Credits Left</h2>
                        <p className="text-2xl font-bold dark:text-white">50</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
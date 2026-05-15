export default function CancellationPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                    Cancellation Policy
                </h1>
                <div className="bg-white dark:bg-slate-800 rounded-lg p-8 shadow space-y-6">
                    <p className="text-slate-600 dark:text-slate-400">
                        Last updated: March 2025
                    </p>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            1. Cancellation by Customer
                        </h2>
                        <div className="space-y-3 text-slate-600 dark:text-slate-400">
                            <p><strong>30+ days before departure:</strong> Full refund (minus processing fee)</p>
                            <p><strong>15-29 days before departure:</strong> 50% refund</p>
                            <p><strong>7-14 days before departure:</strong> 25% refund</p>
                            <p><strong>Less than 7 days:</strong> No refund</p>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            2. Cancellation by Smile For Miles
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            In the rare event that we need to cancel your tour, you will receive a full refund or the option to reschedule to an alternative date.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            3. Force Majeure
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            In case of natural disasters, political unrest, or other unforeseen circumstances, we will work with you to reschedule or provide appropriate refunds.
                        </p>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            4. How to Cancel
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            To cancel your booking, please contact us at baltrotraders1234@gmail.com or call +92 123 456 7890 with your booking reference number.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

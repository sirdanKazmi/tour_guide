export default function FAQPage() {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                    Frequently Asked Questions
                </h1>
                <div className="space-y-6">
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            How do I book a tour?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            You can book a tour by visiting our Destinations page, selecting your preferred package, and clicking the "Book Now" button. Fill in your details and we will contact you to confirm your booking.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            What is included in the tour price?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Tour prices typically include accommodation, transportation, guide services, and some meals as specified in the tour package. Please check the specific tour details for exact inclusions.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            Can I cancel my booking?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Yes, you can cancel your booking. Cancellation policies vary by tour. Please refer to our Cancellation Policy page or contact us for specific details about your booking.
                        </p>
                    </div>
                    <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-3">
                            Do you offer group discounts?
                        </h2>
                        <p className="text-slate-600 dark:text-slate-400">
                            Yes, we offer special discounts for group bookings. Please contact us with your group size and requirements for a customized quote.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

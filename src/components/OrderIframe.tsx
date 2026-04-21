export default function OrderIframe() {
    return (
        <div className="flex-1 w-full bg-white relative z-10 min-h-[600px] h-full">
            {/* 
            * TODO: Replace 'src' with the actual third-party ordering system URL provided by the client.
            * The iframe is currently configured with about:blank.
            */}
            <iframe 
                src="about:blank" 
                className="absolute inset-0 w-full h-full border-0"
                title="Yoramen Online Ordering"
                allow="geolocation; payment"
            />
            
            {/* Temporary Placeholder for when URL is blank */}
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50/80 backdrop-blur-sm pointer-events-none">
                <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm text-center max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center mx-auto mb-4">
                        <svg className="w-5 h-5 text-stone" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h3 className="font-serif text-xl mb-2 text-sumi">Awaiting Integration</h3>
                    <p className="text-stone text-sm">
                        Third-party ordering system URL is not yet provided.
                    </p>
                </div>
            </div>
        </div>
    );
}

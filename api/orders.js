export const config = {
    runtime: 'edge',
};

export default async function handler(request) {
    // Edge Config is Read-Only for store settings. 
    // It cannot be used for high-speed order writing (API limits & latency).
    // We return 501 so the Frontend automatically switches to "Local Ticket Mode".
    return new Response(
        JSON.stringify({
            error: "No Database Connected",
            mode: "local-only",
            message: "Edge Config cannot store live orders. Using Ticket Mode."
        }),
        {
            status: 404, // 404 tells the context "API not found, go local"
            headers: { 'content-type': 'application/json' },
        }
    );
}

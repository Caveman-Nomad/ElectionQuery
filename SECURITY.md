# Security Policy

## Supported Versions
Only the latest branch (`main`) receives active security patches.

## Defensive Practices Implemented
This project incorporates several robust security layers to mitigate common OWASP risk vectors:

1. **Cross-Site Scripting (XSS)**
   - The React frontend uses `dompurify` to aggressively sanitize all Markdown output before it is injected via `dangerouslySetInnerHTML`.
2. **Cross-Origin Resource Sharing (CORS)**
   - Strict CORS policies are enforced on the Node.js backend.
3. **HTTP Header Security**
   - We utilize `helmet` to automatically configure secure HTTP headers, disabling caching of sensitive data and preventing MIME-sniffing.
4. **DDoS & Brute Force Prevention**
   - `express-rate-limit` caps API requests to 100 per 15 minutes per IP address.
5. **HTTP Parameter Pollution**
   - `hpp` is implemented to protect against query string parameter injection attacks.

## Reporting a Vulnerability
If you discover a potential vulnerability, please DO NOT post it in the public issues tracker. 
Instead, please email the maintainer directly. You can expect an acknowledgment within 24 hours.

# Doctrak - Document Tracking System

Doctrak is a document tracking system that allows users to create and track the current status of documents. It utilizes Node.js, RSA for digital signature, Redis for caching, and Node.js cluster for multicore utilization, ensuring efficient performance and secure document handling. Users can create documents and track their progress as they move through various stages and are handled by designated dispatchers and responsible authorities.

## Features

1. **Document Creation**: Users can create new documents within the system.

2. **Digital Signature**: Node RSA is used to apply digital signatures to documents, ensuring data integrity and authentication.

3. **Document Tracking**: The system allows users to track the current status of documents as they progress through different stages.

4. **Dispatcher Handling**: When a document is created, a dispatcher is tagged to handle its routing to the responsible authority.

5. **Multiple Dispatcher Handling**: The system efficiently handles scenarios where multiple dispatchers are available. Requests are distributed among them, and the first dispatcher to select a request takes responsibility for handling it.

6. **Authority Tagging**: The responsible authority is tagged to each document, and they can digitally sign the document using their provided private key.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/your-username/doctrak.git
   cd doctrak
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Configure Redis**:

   Ensure that Redis is installed and running on your system. If not, download and install it from [Redis Website](https://redis.io/download).

4. **Set Environment Variables**:

   Create a `.env` file in the root directory and set the following variables:

   ```env
   PORT=3000
   REDIS_HOST=127.0.0.1
   REDIS_PORT=6379
   REDIS_PASSWORD=your_redis_password
   ```

5. **Generate RSA Key Pair**:

   For each user RSA key pair is generated when user want but only once. Public key is stored inside the database and private key is given to each user which gets download in form of .txt file. To sign the doc user has to upload that file there
6. **Start the Application**:

   Start the application using the following command:

   ```bash
   npm start
   ```

7. **Usage**:

   The application will now be running at `http://localhost:8000`. Users can interact with the system through API endpoints.
Certainly! Let's merge the additional API endpoints for UserRoutes with the previously compiled list of endpoints:

# API Endpoint Readme

## Document Management

1. **New Document**
   - Method: POST
   - Description: Create a new document with the given details.
   - Endpoint: http://localhost:8000/api/document/new

2. **Get Document by ID**
   - Method: GET
   - Description: Retrieve a document using its ID.
   - Endpoint: http://localhost:8000/api/document/get/:document_id

3. **Update Document**
   - Method: PUT
   - Description: Update the details of a specific document.
   - Endpoint: http://localhost:8000/api/document/update/:document_id

4. **Delete Document**
   - Method: DELETE
   - Description: Delete a document using its ID.
   - Endpoint: http://localhost:8000/api/document/delete/:document_id

5. **List All Documents**
   - Method: GET
   - Description: Fetch a list of all available documents.
   - Endpoint: http://localhost:8000/api/document/list_all

6. **Search Documents**
   - Method: GET
   - Description: Search for documents based on specified criteria.
   - Endpoint: http://localhost:8000/api/document/search

7. **Upload Document File**
   - Method: POST
   - Description: Upload a file for a specific document.
   - Endpoint: http://localhost:8000/api/document/upload/:document_id

8. **Download Document File**
   - Method: GET
   - Description: Download the file attached to a specific document.
   - Endpoint: http://localhost:8000/api/document/download/:document_id

## Tags

9. **New Tag**
   - Method: POST
   - Description: Create a new tag for a specific document.
   - Endpoint: http://localhost:8000/api/document/new_tag

10. **All tagged docs**
    - Method: GET
    - Description: Fetch all documents that have been tagged.
    - Endpoint: http://localhost:8000/api/document/all_tagged_docs

11. **Mark As read**
    - Method: PATCH
    - Description: Mark a tag popup as seen for a particular document.
    - Endpoint: http://localhost:8000/api/document/mark_as_read/:tag_id

12. **Delete a tag**
    - Method: DELETE
    - Description: Remove a specific tag from a document.
    - Endpoint: http://localhost:8000/api/document/delete_tag/:tag_id

13. **Select Request**
    - Method: PATCH
    - Description: Select a document for approval.
    - Endpoint: http://localhost:8000/api/document/selectRequest/:request_id

14. **Get Tags**
    - Method: GET
    - Description: Fetch all tags associated with a document.
    - Endpoint: http://localhost:8000/api/document/get_tags/:document_id

15. **See all requests**
    - Method: GET
    - Description: Fetch all document requests.
    - Endpoint: http://localhost:8000/api/document/requests

16. **Mark As done**
    - Method: PATCH
    - Description: Mark a document request as done.
    - Endpoint: http://localhost:8000/api/document/done/:request_id

## Signatures

17. **Approve document**
    - Method: PATCH
    - Description: Approve a document by providing a document ID and a private RSA key for the signature.
    - Endpoint: http://localhost:8000/api/document/approved

18. **Verify Approval**
    - Method: GET
    - Description: Verify the approval status of a document.
    - Endpoint: http://localhost:8000/api/document/verifyapproval/:approval_id

19. **Delete Approval**
    - Method: PATCH
    - Description: Delete the approval status for a specific document.
    - Endpoint: http://localhost:8000/api/document/deleteapproval/:approval_id

20. **Signing Document**
    - Method: PATCH
    - Description: Sign a document using a private RSA key.
    - Endpoint: http://localhost:8000/api/document/signature/:document_id

21. **Verify Documents**
    - Method: GET
    - Description: Verify the signatures of a document.
    - Endpoint: http://localhost:8000/api/document/verifySignatures/:document_id

22. **Delete Signature**
    - Method: GET
    - Description: Delete the signature for a specific document.
    - Endpoint: http://localhost:8000/api/document/deleteSignature/:signature_id

## User Management

23. **Create User**
   - Method: POST
   - Description: Create a new user with the given details.
   - Endpoint: http://localhost:8000/api/user/createUser

24. **Login User**
   - Method: GET
   - Description: Authenticate and login a user.
   - Endpoint: http://localhost:8000/api/user/login

25. **Generate Keys**
   - Method: GET
   - Description: Generate keys for a user. needed Token for authentication
   - Endpoint: http://localhost:8000/api/user/generateKeys


Note: Make sure to replace "http://localhost:8000" with the appropriate base URL of your API server. For endpoint #25, additional information about the method and endpoint is required for complete documentation.

## Conclusion

Doctrak simplifies the process of document creation, tracking, and handling by efficiently utilizing Node.js, RSA for digital signatures, Redis for caching, and Node.js cluster for multicore utilization. The system offers a secure and seamless experience for users to manage their documents and ensure they reach the responsible authorities in a timely manner.

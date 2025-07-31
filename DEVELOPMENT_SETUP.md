# Development Setup Guide

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
NEXT_PUBLIC_API_URL=https://api.trotro.live
NEXT_PUBLIC_CIVIC_CLIENT_ID=your_civic_client_id_here
```

## CORS Issues Resolution

The application is experiencing CORS errors because the backend at `https://api.trotro.live` doesn't allow requests from `localhost:3001`. 

### Temporary Solutions:

1. **Use a CORS Proxy** (for development only):
   - Install a CORS proxy extension in your browser
   - Or use a service like `https://cors-anywhere.herokuapp.com/`

2. **Configure Backend CORS** (if you have access):
   - Add `http://localhost:3001` to the allowed origins in the Django backend
   - Update the CORS configuration in the Django settings

3. **Use a Different Port**:
   - Try running the app on port 3000 instead of 3001
   - Update the backend CORS settings to allow `http://localhost:3000`

## Authentication Flow Fixes

The middleware has been updated to handle CORS errors gracefully:
- No more automatic redirects when API calls fail due to CORS
- Authentication pages will load properly even when the API is unreachable
- Users can still connect wallets and attempt authentication

## Next Steps

1. Create the `.env` file with the correct API URL
2. Configure CORS on the backend or use a CORS proxy
3. Restart the development server
4. Test the authentication flow

## Testing the Fix

After implementing these changes:
1. Navigate to `/auth/login`
2. You should no longer be redirected to the home page
3. CORS errors in the console should be reduced
4. Wallet connection should work properly 
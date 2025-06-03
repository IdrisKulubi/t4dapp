i will update the readme when done

## Getting Started

will be updated  keep it cool 
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

# Youth Adapt Challenge Application

## Enhanced Document Upload System

The business information form now includes an enhanced document upload system with the following features:

### 🚀 New Features

#### 1. **Real-time Upload Feedback**
- **Loading state**: Toast notification shows "Uploading [Document Name]..." during upload
- **Success notification**: Green toast confirms successful upload with document name
- **Error handling**: Red toast alerts for upload failures with retry guidance

#### 2. **Document Preview & Management**
- **Visual preview**: Uploaded documents display with file icon and extracted filename
- **Quick access**: External link button to open documents in new tab
- **Delete option**: Red X button to remove uploaded documents
- **Re-upload capability**: Upload new documents to replace existing ones

#### 3. **Enhanced UI/UX**
- **Upload zones**: Dashed border areas indicate where documents can be uploaded
- **Status indicators**: Green background for successful uploads
- **Responsive design**: Optimized for both desktop and mobile devices
- **Accessibility**: Proper ARIA labels and keyboard navigation

#### 4. **Document Types Supported**
- Business Overview (PDF/DOCX)
- CR12 Document
- Audited Accounts (Last 2 Years)
- Tax Compliance Certificate

### 📱 User Experience Improvements

```typescript
// Toast notifications provide clear feedback
toast.loading("Uploading Business Overview...", { id: "upload-business.businessOverviewUrl" });
toast.success("Business Overview uploaded successfully!", { id: "upload-business.businessOverviewUrl" });
toast.error("Failed to upload Business Overview. Please try again.", { id: "upload-business.businessOverviewUrl" });
```

### 🎨 Visual Features

- **Upload Status**: Real-time visual feedback during upload process
- **Document Cards**: Clean, card-based layout for uploaded documents
- **Action Buttons**: Intuitive icons for preview and delete actions
- **Progress Indication**: Loading states and completion indicators

### 🔧 Technical Implementation

The enhanced upload system uses:
- **Sonner Toast Library**: For elegant notifications
- **React Hook Form Integration**: Seamless form state management
- **UploadThing**: Secure file upload service
- **Lucide Icons**: Modern, accessible iconography
- **Tailwind CSS**: Responsive styling with dark mode support

### Example Usage

When a user uploads a document:
1. Click upload button or drag file to upload zone
2. See loading toast with document name
3. Upon success, document card appears with preview options
4. Can click external link to view document
5. Can click delete button to remove and re-upload

This creates a smooth, professional experience that keeps users informed throughout the upload process.

---

*Enhanced upload system provides professional document management with clear feedback and intuitive controls.*


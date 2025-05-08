import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const auth = (req: Request) => ({ id: "fakeId" }); // Replace with real auth

// Define a reusable document uploader configuration
const documentUploader = f({
  pdf: { maxFileSize: "8MB", maxFileCount: 1 },
  "application/msword": { maxFileSize: "8MB", maxFileCount: 1 }, // .doc
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { maxFileSize: "8MB", maxFileCount: 1 }, // .docx
  // Add other document types if needed e.g. excel, powerpoint
})
.middleware(async ({ req }) => {
  const user = await auth(req); // Replace with your actual authentication logic
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user.id };
})
.onUploadComplete(async ({ metadata, file }) => {
  console.log(`Upload complete for ${file.name} by userId:`, metadata.userId);
  console.log("file url", file.url); 
  return { uploadedBy: metadata.userId, fileName: file.name, fileUrl: file.url };
});

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB" } })
    .middleware(async ({ req }) => {
      const user = await auth(req);
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("file url", file.url); // Use file.url for consistency
      return { uploadedBy: metadata.userId, fileUrl: file.url };
    }),
  // Document uploaders for the business form
  businessOverviewUploader: documentUploader,
  cr12Uploader: documentUploader,
  auditedAccountsUploader: documentUploader,
  taxComplianceUploader: documentUploader,
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 
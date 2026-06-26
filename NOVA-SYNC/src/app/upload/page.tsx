import Upload from "@/components/upload/Upload";

export const metadata = {
  title: "Upload | NOVA-SYNC",
  description: "Upload satellite imagery for AI processing",
};

export default function UploadPage() {
  return (
    <div className="pt-24 pb-16">
      <Upload />
    </div>
  );
}

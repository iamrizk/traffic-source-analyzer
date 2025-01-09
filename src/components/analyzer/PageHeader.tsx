import { Image } from "@/components/ui/image";

export const PageHeader = () => {
  return (
    <div className="flex items-center gap-4 my-16">
      <Image
        src="/lovable-uploads/009ada44-0baa-4c42-a596-8d9778c0e68d.png"
        alt="Ihab's Traffic Source Analyzer"
        className="w-16"
      />
      <div>
        <h1 className="text-3xl font-bold">Ihab's Traffic Source Analyzer</h1>
        <p className="text-gray-600">Analyze and extract marketing attribution parameters from your URLs</p>
      </div>
    </div>
  );
};
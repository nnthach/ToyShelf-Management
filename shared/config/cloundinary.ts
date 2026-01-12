type UploadEntity = "product" | "store" | "staff";

const getUploadConfig = (file: File, entity: UploadEntity) => {
  if (file.type.startsWith("image/")) {
    return {
      folder: `${entity}s/images`,
      tags: `${entity},image`,
    };
  }

  if (file.type.startsWith("video/")) {
    return {
      folder: `${entity}s/videos`,
      tags: `${entity},video`,
    };
  }

  return {
    folder: `${entity}s/models`,
    tags: `${entity},3d`,
  };
};

export const uploadFileToCloudinary = async (
  file: File | null,
  entity: "product" | "store" | "staff"
) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  console.log("cloudName", cloudName);
  console.log("uploadPreset", uploadPreset);

  if (!file) {
    throw new Error("Missing file");
  }

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env");
  }

  const { folder, tags } = getUploadConfig(file, entity);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append("folder", folder);
  formData.append("tags", tags);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
};

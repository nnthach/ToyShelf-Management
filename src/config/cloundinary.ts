type UploadEntity = "product" | "store" | "staff" | "user";

const getUploadConfig = (file: File, entity: UploadEntity) => {
  if (file.type.startsWith("image/")) {
    return {
      folder: `${entity}/images`,
      tags: `${entity},image`,
    };
  }

  if (file.type.startsWith("video/")) {
    return {
      folder: `${entity}/videos`,
      tags: `${entity},video`,
    };
  }

  return {
    folder: `${entity}/models`,
    tags: `${entity},3d`,
  };
};

const getResourceType = (file: File) => {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "raw";
};

const uploadSingleFile = async (file: File, entity: UploadEntity) => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env");
  }

  const { folder, tags } = getUploadConfig(file, entity);

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);
  formData.append(
    "folder",
    `toyscabin/${entity}/${file.type.startsWith("image/") ? "images" : "models"}`,
  );
  formData.append("tags", tags);

  const resourceType = getResourceType(file);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error?.message || "Upload failed");
  }

  return data.secure_url;
};

export const uploadFileToCloudinary = async (
  file: File | File[] | null,
  entity: UploadEntity,
) => {
  if (!file) {
    throw new Error("Missing file");
  }

  if (Array.isArray(file)) {
    const uploads = file.map((item) => uploadSingleFile(item, entity));
    return Promise.all(uploads);
  }

  return uploadSingleFile(file, entity);
};

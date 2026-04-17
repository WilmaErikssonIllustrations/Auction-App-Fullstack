export const uploadImage = async (imageInput: HTMLInputElement) => {
  const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;

  let file;
  if (imageInput && imageInput.files?.[0]) {
    file = imageInput.files?.[0];
  }
  if (!file) {
    return;
  }
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "ml_default");

  const imageResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`,
    {
      method: "POST",
      body: formData,
    },
  );
  return await imageResponse.json();
};

import { API_URL, DEPLOY_URL } from '.';

export const PHONE_API_URL = `${API_URL}/phone`;
export const PHONE_API_ID_URL = (id: string) => `${PHONE_API_URL}/${id}`;
export const PHONE_IMAGE_URL = (imageFileName: string) => `${DEPLOY_URL}/images/${imageFileName}`;
export const PHONE_IMAGE_PATH = (imageFileName: string) => `images/${imageFileName}`;
export const PHONE_IMAGE_PATHS = (imageFileNames: string[]) => imageFileNames.map(PHONE_IMAGE_PATH);
export const PHONE_IMAGE_PATHS_WITH_URL = (imageFileNames: string[]) =>
  imageFileNames.map((imageFileName) => ({
    fileName: imageFileName,
    url: PHONE_IMAGE_URL(imageFileName),
  }));

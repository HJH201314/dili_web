export type ImagePickerFunc = {
  selectImage: () => void;
};

export type ImagePickerModel = {
  file: File;
  url: string;
}[];
import { Image, ImageKind } from '../Image';

export function split(image: Image): Image[] {
  const result = [];
  for (let c = 0; c < image.channels; c++) {
    const channel = Image.createFrom(image, { kind: ImageKind.GREY });
    for (let i = 0; i < channel.data.length; i++) {
      channel.data[i] = image.data[i * image.channels + c];
    }
    result.push(channel);
  }
  return result;
}

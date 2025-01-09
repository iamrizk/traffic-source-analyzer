interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
}

export const Image = ({ src, alt, ...props }: ImageProps) => {
  return <img src={src} alt={alt} {...props} />;
};
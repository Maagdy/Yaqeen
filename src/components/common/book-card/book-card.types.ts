export interface BookCardProps {
  title: string;
  author?: string;
  pdfPath: string;
  pageCount: number;
  coverImage?: string;
  onClick: () => void;
}

export interface Book {
  id: number;
  title: string;
  titleAr: string;
  author: string;
  authorAr: string;
  pdfPath: string;
  pageCount: number;
  coverImage?: string;
}

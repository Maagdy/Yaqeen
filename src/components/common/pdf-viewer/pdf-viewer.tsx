import { useState, useRef, useEffect, useCallback } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslation } from "react-i18next";
import { Close, ZoomIn, ZoomOut, FullscreenExit, Fullscreen } from "@mui/icons-material";
import { IconButton } from "@/components/common";
import type { PdfViewerProps } from "./pdf-viewer.types";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// Number of pages to render before and after current page
const PAGE_BUFFER = 2;

export const PdfViewer: React.FC<PdfViewerProps> = ({ file, onClose }) => {
  const { t } = useTranslation();
  const [numPages, setNumPages] = useState<number>(0);
  const [scale, setScale] = useState<number>(1.2);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageInput, setPageInput] = useState<string>("1");
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [visiblePages, setVisiblePages] = useState<Set<number>>(new Set([1]));
  const containerRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    pageRefs.current = new Array(numPages);
  };

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.2, 3.0));
  };

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handlePageInputSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pageNum = parseInt(pageInput);
    if (pageNum >= 1 && pageNum <= numPages) {
      scrollToPage(pageNum);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const scrollToPage = (pageNum: number) => {
    const pageElement = pageRefs.current[pageNum - 1];
    if (pageElement) {
      pageElement.scrollIntoView({ behavior: "smooth", block: "start" });
      setCurrentPage(pageNum);
      setPageInput(pageNum.toString());
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Calculate which pages should be rendered
  const updateVisiblePages = useCallback(() => {
    const newVisiblePages = new Set<number>();
    const start = Math.max(1, currentPage - PAGE_BUFFER);
    const end = Math.min(numPages, currentPage + PAGE_BUFFER);

    for (let i = start; i <= end; i++) {
      newVisiblePages.add(i);
    }

    setVisiblePages(newVisiblePages);
  }, [currentPage, numPages]);

  // Update visible pages when current page changes
  useEffect(() => {
    updateVisiblePages();
  }, [updateVisiblePages]);

  // Track current page while scrolling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.scrollTop;
      const containerHeight = container.clientHeight;
      const containerCenter = containerTop + containerHeight / 2;

      // Find which page is currently in view
      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageElement = pageRefs.current[i];
        if (pageElement) {
          const pageTop = pageElement.offsetTop;
          const pageBottom = pageTop + pageElement.clientHeight;

          if (containerCenter >= pageTop && containerCenter <= pageBottom) {
            setCurrentPage(i + 1);
            setPageInput((i + 1).toString());
            break;
          }
        }
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [numPages]);

  // Check if a page should be rendered
  const shouldRenderPage = (pageNum: number): boolean => {
    return visiblePages.has(pageNum);
  };

  return (
    <div className="fixed inset-0 z-9999 bg-black bg-opacity-95 flex flex-col">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
        {/* Left side - Close button */}
        <div className="flex items-center gap-2">
          <IconButton
            icon={<Close className="text-text-primary" />}
            onClick={onClose}
            ariaLabel={t("common.close")}
            variant="default"
            label=""
          />
        </div>

        {/* Center - Page Navigation */}
        <div className="flex items-center gap-3">
          <form onSubmit={handlePageInputSubmit} className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max={numPages}
              value={pageInput}
              onChange={handlePageInputChange}
              className="w-16 px-2 py-1 text-center bg-background text-text-primary border border-border rounded focus:outline-none focus:border-primary"
            />
            <span className="text-text-primary text-sm">
              / {numPages}
            </span>
          </form>
        </div>

        {/* Right side - Zoom and Fullscreen Controls */}
        <div className="flex items-center gap-2">
          <IconButton
            icon={<ZoomOut />}
            onClick={zoomOut}
            ariaLabel="Zoom Out"
            variant="default"
            disabled={scale <= 0.5}
            label=""
          />
          <span className="text-text-primary px-2 min-w-16 text-center">
            {Math.round(scale * 100)}%
          </span>
          <IconButton
            icon={<ZoomIn />}
            onClick={zoomIn}
            ariaLabel="Zoom In"
            variant="default"
            disabled={scale >= 3.0}
            label=""
          />
          <div className="w-px h-6 bg-border mx-2" />
          <IconButton
            icon={isFullscreen ? <FullscreenExit /> : <Fullscreen />}
            onClick={toggleFullscreen}
            ariaLabel="Toggle Fullscreen"
            variant="default"
            label=""
          />
        </div>
      </div>

      {/* PDF Content - Scrollable */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-gray-800"
      >
        <div className="flex flex-col items-center py-8 gap-4">
          <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="text-white text-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p>{t("common.loading")}</p>
              </div>
            }
            error={
              <div className="text-red-500 text-center py-20">
                <p className="text-lg font-semibold mb-2">
                  {t("prophet_stories.error_loading_pdf")}
                </p>
                <p className="text-sm">Please check if the PDF file exists and try again.</p>
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => {
              const pageNum = index + 1;
              const shouldRender = shouldRenderPage(pageNum);

              return (
                <div
                  key={`page_${pageNum}`}
                  ref={(el) => {
                    pageRefs.current[index] = el;
                  }}
                  className="mb-4 shadow-2xl"
                  style={{ minHeight: shouldRender ? 'auto' : '1000px' }}
                >
                  {shouldRender ? (
                    <>
                      <Page
                        pageNumber={pageNum}
                        scale={scale}
                        loading={
                          <div className="bg-gray-700 flex items-center justify-center" style={{ minHeight: '800px' }}>
                            <div className="text-white text-sm">
                              {t("common.loading")} {t("common.page")} {pageNum}...
                            </div>
                          </div>
                        }
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                      />
                      {/* Page number indicator */}
                      <div className="text-center py-2">
                        <span className="text-gray-400 text-sm">
                          {t("common.page")} {pageNum}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="bg-gray-700 flex items-center justify-center" style={{ minHeight: '1000px' }}>
                      <div className="text-gray-500 text-sm">
                        {t("common.page")} {pageNum}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </Document>
        </div>
      </div>
    </div>
  );
};

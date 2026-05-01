import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

interface PaginationControlsProps {
  offset: number;
  limit: number;
  totalItems: number;
  isLoading?: boolean;
  onLoadMore: () => void;
  onReset?: () => void;
}

/**
 * Pagination controls for paginated data lists
 * Shows load more button when there are more items to fetch
 */
export const PaginationControls = ({
  offset,
  limit,
  totalItems,
  isLoading,
  onLoadMore,
  onReset,
}: PaginationControlsProps) => {
  const hasMore = offset + limit < totalItems;
  const currentCount = offset + totalItems;

  return (
    <div className="flex items-center justify-between py-4">
      <div className="text-sm text-muted-foreground">
        {totalItems === 0 ? "لا توجد عناصر" : `يتم عرض ${Math.min(offset + limit, currentCount)} من ${currentCount}`}
      </div>
      <div className="flex gap-2">
        {onReset && (
          <Button variant="outline" size="sm" onClick={onReset}>
            إعادة تعيين
          </Button>
        )}
        {hasMore && (
          <Button onClick={onLoadMore} disabled={isLoading} className="gap-2">
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "جاري التحميل..." : "تحميل المزيد"}
          </Button>
        )}
      </div>
    </div>
  );
};

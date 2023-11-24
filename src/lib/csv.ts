import {DateRange} from "react-day-picker";
import {errorToast} from "@/lib/toasts";

export async function getSalesCSV(date?: DateRange | undefined) {
  try {
    const requestUrl = date ? `/api/csv?from=${date.from?.toISOString()}&to=${date.to?.toISOString()}` : `/api/csv`;
    const response = await fetch(requestUrl, {
      method: "GET"
    });

    const responseBody = await response.json();
    if (!response.ok) throw responseBody.error;
    const url = window.URL.createObjectURL(
        new Blob([responseBody.data], {
          type: "text/plain"
        })
    );

    const link = document.createElement('a');
    link.href = url;
    if (date) {
      link.setAttribute(
          'download',
          `sales-${date?.from?.toLocaleDateString()?.replace(/-/g, '.')}\
-${date?.to?.toLocaleDateString()?.replace(/-/g, '.')}.csv`
      )
    }
    document.body.appendChild(link);
    link.click();
    link.parentNode?.removeChild(link);

  } catch (err) {
    errorToast("File could not be downloaded.");
    console.error(err)
  }
}
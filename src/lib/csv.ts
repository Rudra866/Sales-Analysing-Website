import {DateRange} from "react-day-picker";
import {toast} from "@/components/ui/use-toast";

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

    // Append to html link element page
    document.body.appendChild(link);

    // Start download
    link.click();

    // Clean up and remove the link
    link.parentNode?.removeChild(link);


  } catch (err) {
    toast({
      title: "Error!",
      description: "File could not be downloaded."
    })
    console.log(err)
  }
}
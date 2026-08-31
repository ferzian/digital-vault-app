import { HiInbox } from "react-icons/hi2";

export function AdminGoodsTab() {
  const productsList: Array<{
    id: string;
    title: string;
    category: string;
    price: number;
    status: string;
  }> = [];

  return (
    <div className="p-6">
      {productsList.length === 0 ? (
        <div className="py-14 px-4 text-center flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-950/40">
          <div className="w-12 h-12 rounded-xl bg-sky-500/10 dark:bg-sky-950/50 text-sky-500 flex items-center justify-center mb-3">
            <HiInbox className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">
            Katalog Produk Masih Kosong
          </h4>
          <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400 max-w-sm">
            Belum ada produk digital yang didaftarkan ke dalam database sistem.
          </p>
        </div>
      ) : null}
    </div>
  );
}

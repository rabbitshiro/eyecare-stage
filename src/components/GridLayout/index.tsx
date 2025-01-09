// Models
import { ILayoutModel } from "@/models/ILayout.interface";
import { IUrl } from "@/models/IUrl.interface";
import { IWidgetModel } from "@/models/IWidget.interface";

// Components
import WidgetGenerator from "@/components/WidgetGenerator";
// import Analytics from "@/components/Analytics";

type Props = {
  data: ILayoutModel;
  url: IUrl;
  pageType?: string;
};

const GridLayout = ({ data, url, pageType }: Props) => {
  const widgetList = data?.widgets;

  return (
    <>
      <main>
        {widgetList?.map((widget: IWidgetModel, key: number) => (
          <section
            className={`${widget.widgetName}`}
            key={key}
            id={data?.settings?.PlacementsAutoFocus?.[key] || undefined}
          >
            <WidgetGenerator
              {...widget}
              url={url}
              settings={data.settings}
              pageType={pageType}
              widgetContainerId={key}
            />
          </section>
        ))}
      </main>
      {/* <Analytics pageType={pageType} prop20={data?.title} /> */}
    </>
  );
};

export default GridLayout;

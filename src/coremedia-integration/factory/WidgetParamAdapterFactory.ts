// Modules
import { Nullable } from "../../../../Projects/fe-emeu-app/src/models/Nullable.interface";
import { Factory } from "./Factory";
import { IAdapter } from "../../../../Projects/fe-emeu-app/src/adapters/Adapter";
import { GenericWidgetNameModel } from "@/models/IGenericWidgetValue.interface";

// Adapters
import { SampleAdapter } from "../adapters/widgets/Sample.adapter";

export class WidgetParamAdapterFactory extends Factory<
  GenericWidgetNameModel,
  Nullable<IAdapter>
> {
  instance: (comparator: GenericWidgetNameModel) => Nullable<IAdapter> = (
    comparator
  ) => {
    switch (comparator) {
      case "Sample":
        return new SampleAdapter();
      default:
        return null;
    }
  };
}

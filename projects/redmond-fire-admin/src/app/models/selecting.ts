import { DbQueryObject } from "projects/redmond-fire-library/src/lib/services/db.service";
import { SiteEntityCollectionType } from 'projects/redmond-fire-library/src/lib/models/docs'
import { DbSearchInputData } from "../@shared/ui/db-search/db-search.component";

export interface SelectEntityInputData {
  collection?: SiteEntityCollectionType;
  path?: string;
  elem?: any;
  query?: DbQueryObject;
  selected?: any[];
  collections?: any[];
  maxWidth?: string;
  searchData?: DbSearchInputData;
  updateCallback?: Function;
  containerClasses?: string;
  multiple?: boolean;
  [key: string]: any;
}
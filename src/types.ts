export interface IconTheme {
  iconDefinitions?: { [key: string]: { iconPath: string } };
  file?: string;
  folder?: string;
  folderExpanded?: string;
  rootFolder?: string;
  rootFolderExpanded?: string;
  folderNames?: { [key: string]: string };
  folderNamesExpanded?: { [key: string]: string };
  fileExtensions?: { [key: string]: string };
  fileNames?: { [key: string]: string };
  languageIds?: { [key: string]: string };
  light?: IconTheme;
  highContrast?: IconTheme;
  hidesExplorerArrows?: boolean;
}

export interface IconMap {
  icons: {
    [iconName: string]: string; // path to svg relative to extension root
  };
  fileExtensions: {
    [extension: string]: string; // icon name
  };
  fileNames: {
    [fileName: string]: string; // icon name
  };
  folderNames: {
    [folderName: string]: string; // icon name
  };
  folderNamesExpanded: {
    [folderName: string]: string; // icon name
  };
  languageIds: {
    [languageId: string]: string; // icon name
  };
}

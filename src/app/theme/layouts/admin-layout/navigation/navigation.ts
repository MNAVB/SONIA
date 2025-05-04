export interface NavigationItem {
  id: string;
  title: string;
  type: 'item' | 'collapse' | 'group';
  translate?: string;
  icon?: string;
  hidden?: boolean;
  url?: string;
  classes?: string;
  groupClasses?: string;
  exactMatch?: boolean;
  external?: boolean;
  target?: boolean;
  breadcrumbs?: boolean;
  children?: NavigationItem[];
  link?: string;
  description?: string;
  path?: string;
}

export const NavigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'default',
        title: 'Default',
        type: 'item',
        classes: 'nav-item',
        url: '/dashboard',
        icon: 'dashboard',
        breadcrumbs: false
      }
    ]
  },
  // Añadir este objeto al array NavigationItems, junto a los demás grupos de navegación
  {
    id: 'modulos',
    title: 'Modulos',
    type: 'group',
    icon: 'icon-navigation',
    children: [
      {
        id: 'categorias',
        title: 'categorias',
        type: 'item',
        classes: 'nav-item',
        url: '/categorias',
        icon: 'dashboard', // Puedes cambiar por otro icono disponible
        breadcrumbs: false
      },
      {
        id: 'productos',
        title: 'productos',
        type: 'item',
        classes: 'nav-item',
        url: '/productos',
        icon: 'chrome', // Otro icono disponible
        breadcrumbs: false
      },
      {
        id: 'ventas',
        title: 'ventas',
        type: 'item',
        classes: 'nav-item',
        url: '/ventas',
        icon: 'chrome', // Otro icono disponible
        breadcrumbs: false
      }
    ]
  } ,
];

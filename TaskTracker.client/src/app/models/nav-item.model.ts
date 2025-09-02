export class NavItem {
  routerLink: string = "";
  matIcon: string = "";
  title: string = "";

  constructor(routerLink: string, matIcon: string, title: string) {
    this.routerLink = routerLink;
    this.matIcon = matIcon;
    this.title = title;
  }
}

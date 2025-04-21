export class NavbarComponent {
    static render(): string {
        return `
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <h1 class="navbar-brand"><a class="nav-link" href="/">AllergieApp</a></h1>
                <ul class="navbar-nav ml-3">
                    <li class="nav-item"><a class="nav-link" href="/">index</a></li>
                    <li class="nav-item"><a class="nav-link" href="/test">test</a></li>
                </ul>
            </nav>
        `;
    }
}
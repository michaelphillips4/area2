class OrcaArticleComponent extends HTMLElement {
  connectedCallback() {
    const template = document.getElementById("orca-article-template");
    const clone = template.content.cloneNode(true);
    const header = clone.querySelector("a.orca-article-header");
    header.innerText = this.dataset.title;
    header.href = this.dataset.url;
    clone.querySelector("#content").innerHTML = this.innerHTML;
    const image = clone.querySelector(".app-image");
    image.src = this.dataset.image;
    image.alt = this.dataset.imageText;
    this.innerHTML = "";
    this.appendChild(clone);
  }
}

customElements.define("orca-article", OrcaArticleComponent);

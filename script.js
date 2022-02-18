let max_items = Math.floor(window.innerWidth / 145 * 5);
let data = [];
let search_items = []
let page_index = 1;
let url_str = location.href;
let container_index = document.querySelector("#container-index");
let search_text = document.getElementById('search').value;
let url = new URL(url_str);
let search_params = url.searchParams;
page_index = (search_params.get('id') && search_params.get('id') > 0) ? search_params.get('id') : 1;
search_text = (search_params.get('search')) ? search_params.get('search') : "";
let svg = ""

// console.log(page_index)
get_data();

async function search_elements(search = "") {
    if (search === "") {
        search_text = document.getElementById('search').value;
        page_index = 1
    } else {
        document.getElementById('search').value = search;
    }
    if (!page_index) {
        page_index = 1
    }
    var x = "";
    search_items = data.filter(i => (i.name) ? i.name.toLowerCase().includes(search_text.toLowerCase()) : console.log())
    print_data(search_items)
    window.history.pushState('html', 'Title', `?search=${search_text}&id=${page_index}`);
}


function get_data() {
    fetch('icons.json')
        .then(response => response.json())
        .then(result => {
            data = result
            if (search_text && search_text != "") {
                search_elements(search_text);
            } else {

                print_data(data)
            }
        })
}

async function print_data(items) {

    var html = ""
    await Promise.all(items.map(async(element, i) => {
        if (i >= max_items * (page_index - 1) && i < max_items * page_index)
            await fetch(`${element.url}`)
            .then(response => response.text())
            .then(result => {

                html += `<div id="svg_${i}" onclick="get_content_svg('svg_${i}','${element.url}')" class="item">` +
                    // `<img class="img" src='icons/${element.url}' alt="" srcset="">` +
                    result +
                    `<h4>${element.name}</h4>` +
                    "</div> "
            });
    }));
    var index_html = ""
    document.getElementById("container").innerHTML = html;
    for (i = 1; i <= items.length / max_items; i++) {
        index_html += `<div onclick="set_page_index(${i})" class="number button ${i == page_index ? 'active' : ''}">${i}</div>`
    }
    document.getElementById("index_page_container").innerHTML = index_html;
    let next = document.querySelector(".next")
    let back = document.querySelector(".back")
    if (container_index.scrollWidth > 0) {

        next.classList.remove('d-none');
        back.classList.remove('d-none')
    } else {
        next.classList.add('d-none');
        back.classList.add('d-none')
    }
}

function set_page_index(i) {
    page_index = i;
    if (search_items.length > 0) {
        window.history.pushState('html', 'Title', `?search=${search_text}&id=${page_index}`);
        print_data(search_items)
    } else
        print_data(data)
}

function get_content_svg(id, url) {
    svg = document.getElementById(id).childNodes[0].outerHTML;
    // svg = svg.split("script")[0];
    svg = svg.split('<').join("\n<");
    document.getElementById("svg").value = svg;
    document.getElementById("svg-container-text").classList.remove('d-none');
    document.getElementById("icon").innerHTML = svg
    document.getElementById("download").href = url;
    document.getElementById("download").download = url;
}

function change_color() {
    let color = document.getElementById("color").value;
    document.body.style.setProperty('--primary', color);
}

function next_page() {
    container_index.scrollTo(container_index.scrollLeft + window.innerWidth / 2, 0)
}

function back_page() {
    container_index.scrollTo(container_index.scrollLeft - window.innerWidth / 2, 0)
}

function copy_svg() {
    navigator.clipboard.writeText(svg);
}
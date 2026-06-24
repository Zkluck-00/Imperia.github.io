window.MapRenderer = {
  render(courseId, containerId){
    const course = NodeEngine.getCourse(courseId);
    const el = document.getElementById(containerId);
    if(!course || !el) return;

    let html = `<div class="course-map-v16">`;

    course.nodes.forEach((n,i)=>{
      html += `
        <div class="node node-${n.status} node-${n.type}" data-id="${n.id}">
          <div class="node-circle">${n.id}</div>
          <div class="node-title">${n.title}</div>
        </div>
      `;
      if(i < course.nodes.length-1){
        html += `<div class="connector"></div>`;
      }
    });

    html += `</div>`;
    el.innerHTML = html;

    document.querySelectorAll(".node-active").forEach(n=>{
      n.addEventListener("click",()=>{
        n.classList.add("pulse");
      });
    });
  }
};

window.NodeEngine = {
  getCourse(id){
    return window.IMPERIA_NODES.find(c=>c.id===id);
  },

  completeNode(courseId,nodeId){
    const course = this.getCourse(courseId);
    if(!course) return;

    const idx = course.nodes.findIndex(n=>n.id===nodeId);
    if(idx === -1) return;

    course.nodes[idx].status = "completed";

    if(course.nodes[idx+1]){
      course.nodes[idx+1].status = "active";
    }

    this.save(courseId);
  },

  save(courseId){
    const course = this.getCourse(courseId);
    localStorage.setItem("imperia_nodes_"+courseId, JSON.stringify(course.nodes));
  },

  load(courseId){
    const data = localStorage.getItem("imperia_nodes_"+courseId);
    if(!data) return;

    const course = this.getCourse(courseId);
    if(course){
      course.nodes = JSON.parse(data);
    }
  }
};

$(function(){
    // Initialize Fancytree
    $("#tree").fancytree({
      extensions: ["glyph", "edit", "dnd"],
      checkbox: true,
      selectMode: 2,
      icons: false,
      tabbable: true,
      glyph: {
        map: {
          // doc: "glyphicon glyphicon-file",
          // docOpen: "glyphicon glyphicon-file",
          doc: "glyphicon glyphicon-record",
          checkbox: "glyphicon glyphicon-unchecked",
          checkboxSelected: "glyphicon glyphicon-check",
          checkboxUnknown: "glyphicon glyphicon-share",
          error: "glyphicon glyphicon-warning-sign",
          expanderClosed: "glyphicon glyphicon-plus-sign",
          expanderLazy: "glyphicon glyphicon-plus-sign",
          // expanderLazy: "glyphicon glyphicon-expand",
          expanderOpen: "glyphicon glyphicon-minus-sign",
          // expanderOpen: "glyphicon glyphicon-collapse-down",
          // folder: "glyphicon glyphicon-folder-close",
          folder: "glyphicon glyphicon-chevron-right",
          // folderOpen: "glyphicon glyphicon-folder-open",
          folderOpen: "glyphicon glyphicon-chevron-down",
          loading: "glyphicon glyphicon-refresh"
          // loading: "icon-spinner icon-spin"
        }
      },
//      source: {url: "ajax-tree-plain.json", debugDelay: 1000},
      // source: {url: "ajax-tree-taxonomy.json", debugDelay: 1000},
      source: [
      {title: "This is the first point of the essay.", key: "1"},
      {title: "Here's the second point, which is also really important!", key: "2", expanded:true, children: [
      {title: "And look, a third point!", key: "3"},
      {title: "The fourth point is the very best.", key: "4", expanded:true, children: [
        {title: "Here is some totally random text.", key: "5"},
      ]},
      ]}
      ],
      edit: {
        // Available options with their default:
        adjustWidthOfs: 4,   // null: don't adjust input size to content
        inputCss: {minWidth: "3em"},
        triggerCancel: ["esc", "tab"],
        // triggerStart: ["click"],
        triggerStart: ["click", "f2", "shift+click", "mac+enter"],
        beforeClose: $.noop, // Return false to prevent cancel/save (data.input is available)
        beforeEdit: $.noop,  // Return false to prevent edit mode
        close: $.noop,       // Editor was removed
        edit: $.noop,        // Editor was opened (available as data.input)
        save: $.noop         // Save data.input.val() or return false to keep editor open
      },

      dnd: {
        autoExpandMS: 400,
        focusOnClick: true,
        preventVoidMoves: true, // Prevent dropping nodes 'before self', etc.
        preventRecursiveMoves: true, // Prevent dropping nodes on own descendants
        dragStart: function(node, data) {
          /** This function MUST be defined to enable dragging for the tree.
           *  Return false to cancel dragging of node.
           */
           return true;
         },
         dragEnter: function(node, data) {
          /** data.otherNode may be null for non-fancytree droppables.
           *  Return false to disallow dropping on node. In this case
           *  dragOver and dragLeave are not called.
           *  Return 'over', 'before, or 'after' to force a hitMode.
           *  Return ['before', 'after'] to restrict available hitModes.
           *  Any other return value will calc the hitMode from the cursor position.
           */
          // Prevent dropping a parent below another parent (only sort
          // nodes under the same parent)
/*           if(node.parent !== data.otherNode.parent){
            return false;
          }
          // Don't allow dropping *over* a node (would create a child)
          return ["before", "after"];
          */
          return true;
        },
        dragDrop: function(node, data) {
          /** This function MUST be defined to enable dropping of items on
           *  the tree.
           */
           data.otherNode.moveTo(node, data.hitMode);
         }
       },

      // lazyLoad: function(event, ctx) {
        // ctx.result = {url: "ajax-sub2.json", debugDelay: 1000};
      // }
    });
});

function expandAll()
  {
    $("#tree").fancytree("getRootNode").visit(function(node){
      node.setExpanded(true);
    });
  }

  function collapseAll()
  {
   $("#tree").fancytree("getRootNode").visit(function(node){
    node.setExpanded(false);
  });
 }

 function addNode()
 {
  var newData = {title: ""};

  var tree = $("#tree").fancytree("getTree");
  var node = tree.getActiveNode();

  if (node)
  {
    var children = node.getChildren();
    var newNode = node.appendSibling(newData);
    if (children)
    {
      node.removeChildren();
      node.setExpanded(false);
      newNode.addChildren(children);
      newNode.setExpanded(true);
    }
  }
  else
  {
    var rootNode = $("#tree").fancytree("getRootNode");
    var newNode = rootNode.addChildren(newData)
  }

  newNode.editStart();
}

function moveRight()
{
  var tree = $("#tree").fancytree("getTree");
  var node = tree.getActiveNode();
  var prevSibling = node.getPrevSibling();
  if (prevSibling)
  {
    node.moveTo(prevSibling, "child")
    prevSibling.setExpanded(true);
  }
}

function moveLeft()
{
  var tree = $("#tree").fancytree("getTree");
  var node = tree.getActiveNode();
  var parent = node.parent;
    if (!parent.parent) // making sure the parent is not ROOT
    {
      return;
    }
    // if it's the first item in a list...
    var isFirstInList = node.getIndex() == 0;
    node.moveTo(parent, "after")
    if (isFirstInList)
    {
      var children = parent.getChildren();
      parent.removeChildren();
      parent.setExpanded(false);

      node.addChildren(children);
      node.setExpanded(true);
    }
  }
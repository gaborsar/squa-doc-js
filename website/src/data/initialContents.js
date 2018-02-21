import Delta from "quill-delta";

export default new Delta({
  ops: [
    {
      insert: "Heading level one"
    },
    {
      insert: "\n",
      attributes: {
        type: "heading-one",
        align: "center"
      }
    },
    {
      insert: "Heading level two"
    },
    {
      insert: "\n",
      attributes: {
        type: "heading-two",
        align: "center"
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus."
    },
    {
      insert: "\n",
      attributes: {
        type: "blockquote"
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    },
    {
      insert: "Curabitur iaculis vestibulum lorem"
    },
    {
      insert: "\n",
      attributes: {
        type: "unordered-list-item"
      }
    },
    {
      insert: "Condimentum aliquam turpis iaculis molestie"
    },
    {
      insert: "\n",
      attributes: {
        type: "unordered-list-item",
        indent: 1
      }
    },
    {
      insert: "Ut vehicula libero tellus"
    },
    {
      insert: "\n",
      attributes: {
        type: "unordered-list-item",
        indent: 1
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    },
    {
      insert: "Curabitur iaculis vestibulum lorem"
    },
    {
      insert: "\n",
      attributes: {
        type: "ordered-list-item"
      }
    },
    {
      insert: "Condimentum aliquam turpis iaculis molestie"
    },
    {
      insert: "\n",
      attributes: {
        type: "ordered-list-item",
        indent: 1
      }
    },
    {
      insert: "Ut vehicula libero tellus"
    },
    {
      insert: "\n",
      attributes: {
        type: "ordered-list-item",
        indent: 1
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    },
    {
      insert: "Curabitur iaculis vestibulum lorem"
    },
    {
      insert: "\n",
      attributes: {
        type: "checkable"
      }
    },
    {
      insert: "Condimentum aliquam turpis iaculis molestie"
    },
    {
      insert: "\n",
      attributes: {
        type: "checkable",
        checked: true,
        indent: 1
      }
    },
    {
      insert: "Ut vehicula libero tellus"
    },
    {
      insert: "\n",
      attributes: {
        type: "checkable",
        checked: true,
        indent: 1
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    },
    {
      insert: "procedure bubbleSort( A : list of sortable items },"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "n = length(A},"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "repeat"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "    swapped = false"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "    for i = 1 to n-1 inclusive do"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "        /* if this pair is out of order */"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "        if A[i-1] > A[i] then"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "            /* swap them and remember something changed */"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "            swap( A[i-1], A[i] },"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "            swapped = true"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "        end if"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "    end for"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "until not swapped"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert: "end procedure"
    },
    {
      insert: "\n",
      attributes: {
        type: "code"
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    },
    {
      insert: {
        "block-image": "/images/javascript.256.svg"
      },
      attributes: {
        alt: "JavaScript",
        caption: "JavaScript",
        align: "center"
      }
    },
    {
      insert:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh "
    },
    {
      insert: {
        "inline-image": "/images/javascript.19.svg"
      },
      attributes: {
        alt: "JavaScript"
      }
    },
    {
      insert:
        " risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
    }
  ]
});

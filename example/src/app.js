import React from "react";
import ReactDOM from "react-dom";
import { Delta } from "../../src/SquaDocEditor";
import App from "./components/App";

const initialContents = new Delta()
  .insert("Heading level one")
  .insert("\n", {
    type: "heading-one",
    align: "center"
  })

  .insert("Heading level two")
  .insert("\n", {
    type: "heading-two",
    align: "center"
  })

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  )

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus."
  )
  .insert("\n", {
    type: "blockquote"
  })

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  )

  .insert("Curabitur iaculis vestibulum lorem")
  .insert("\n", {
    type: "unordered-list-item"
  })
  .insert("Condimentum aliquam turpis iaculis molestie")
  .insert("\n", {
    type: "unordered-list-item",
    indent: 1
  })
  .insert("Ut vehicula libero tellus")
  .insert("\n", {
    type: "unordered-list-item",
    indent: 1
  })

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  )

  .insert("Curabitur iaculis vestibulum lorem")
  .insert("\n", {
    type: "ordered-list-item"
  })
  .insert("Condimentum aliquam turpis iaculis molestie")
  .insert("\n", {
    type: "ordered-list-item",
    indent: 1
  })
  .insert("Ut vehicula libero tellus")
  .insert("\n", {
    type: "ordered-list-item",
    indent: 1
  })

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  )

  .insert("Curabitur iaculis vestibulum lorem")
  .insert("\n", {
    type: "checkable"
  })
  .insert("Condimentum aliquam turpis iaculis molestie")
  .insert("\n", {
    type: "checkable",
    checked: true,
    indent: 1
  })
  .insert("Ut vehicula libero tellus")
  .insert("\n", {
    type: "checkable",
    checked: true,
    indent: 1
  })

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  )

  .insert("procedure bubbleSort( A : list of sortable items )")
  .insert("\n", { type: "code" })
  .insert("n = length(A)")
  .insert("\n", { type: "code" })
  .insert("repeat")
  .insert("\n", { type: "code" })
  .insert("    swapped = false")
  .insert("\n", { type: "code" })
  .insert("    for i = 1 to n-1 inclusive do")
  .insert("\n", { type: "code" })
  .insert("        /* if this pair is out of order */")
  .insert("\n", { type: "code" })
  .insert("        if A[i-1] > A[i] then")
  .insert("\n", { type: "code" })
  .insert("            /* swap them and remember something changed */")
  .insert("\n", { type: "code" })
  .insert("            swap( A[i-1], A[i] )")
  .insert("\n", { type: "code" })
  .insert("            swapped = true")
  .insert("\n", { type: "code" })
  .insert("        end if")
  .insert("\n", { type: "code" })
  .insert("    end for")
  .insert("\n", { type: "code" })
  .insert("until not swapped")
  .insert("\n", { type: "code" })
  .insert("end procedure")
  .insert("\n", { type: "code" })

  .insert(
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  )

  .insert(
    {
      "block-image": "/images/javascript.256.svg"
    },
    {
      alt: "JavaScript",
      caption: "JavaScript"
    }
  )

  .insert("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc nibh ")

  .insert(
    {
      "inline-image": "/images/javascript.19.svg"
    },
    {
      alt: "JavaScript"
    }
  )
  .insert(
    " risus, bibendum vel massa ac, lacinia fermentum lectus. Mauris id nulla ipsum. Suspendisse potenti. Suspendisse et lacus pulvinar, fermentum ipsum cursus, lacinia felis. Etiam dapibus, ex nec blandit ornare, tellus ante ultrices lorem, sed ultricies massa risus.\n"
  );

ReactDOM.render(
  <App initialContents={initialContents} />,
  document.getElementById("app")
);

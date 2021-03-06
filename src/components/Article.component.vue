<template lang="pug">
.article
  v-runtime-template(:template="content" v-if="content")
  div(v-else)
    h1 No se ha encontrado el archivo
</template>

<script>
import VRuntimeTemplate from 'v-runtime-template';
import Alarm from '@/components/Alarm.component.vue';
import Demo from '@/components/Demo.component.vue';
import Collapse from '@/components/Collapse.component.vue';
import Codegroup from '@/components/Codegroup.component.vue';

export default {
  components: {
    VRuntimeTemplate,
    Alarm,
    Demo,
    Collapse,
    Codegroup,
  },

  props: {
    data: {
      type: String,
      required: true,
    },
  },

  computed: {
    content() {
      return `<div>${this.data}</div>`;
    },
  },
};
</script>

<style lang="scss">
.article {
  img {
    border: 1px solid color(gray6);
    border-radius: $border-radius;
    box-shadow: 0 5px 10px color(gray6);
  }

  h1 + p {
    font-size: font-size(h4);
    line-height: 1.8rem;
    color: color(gray4);
  }

  h1 + p code {
    font-size: font-size(h5);
  }

  h2 {
    padding-top: double();
    margin-top: triple();
    font-size: font-size(h3);
    border-top: 1px solid color(border);
  }

  h3 {
    font-size: font-size(h4);
    line-height: line-height(h4);
  }

  h4 {
    font-size: font-size(h5);
    line-height: line-height(h5);
  }

  h4 + .code-toolbar {
    margin-top: half();
  }

  h5,
  h6 {
    font-size: font-size(base);
    line-height: line-height(base);
  }

  blockquote {
    padding-left: simple();
    margin: double() 0;
    color: color(gray4);
    background-color: #ffffff;
    border-left: 4px solid color(brand);
  }

  hr {
    background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0) 50%, color(border) 50%);
  }

  .customDemo {
    padding: 0 simple();
    border: 1px solid color(border);
    border-radius: $border-radius;

    .codegroup__files,
    .code-toolbar {
      margin-right: simple('-');
      margin-left: simple('-');
    }

    pre[data-lang] {
      border-bottom: 1px solid color(border);
      border-radius: $border-radius $border-radius 0 0;
    }
  }

  table {
    th {
      font-size: font-size(small2);
      font-weight: font-weight(bold);
      color: color(gray4);
      text-transform: uppercase;
      background-color: color(gray7);
    }

    td {
      font-size: font-size(small1);
      color: color(gray2);
      border-bottom: 1px solid color(border);

      code {
        padding: 0.2rem 0.4rem;
        font-family: font-family(base);
        font-size: 0.95em;
        font-weight: 400;
        color: color(gray3);
      }

      &:first-of-type {
        font-weight: font-weight(bold);
        white-space: nowrap;
      }
    }
  }

  .table-cheatsheet {
    td:nth-of-type(1) {
      font-weight: font-weight(bold);
    }
    td:nth-of-type(2) {
      font-family: font-family(monospace);
      font-size: font-size(small2);
      line-height: 1.2rem;
      color: color(brand);
    }
  }

  ol {
    list-style: none;
    counter-reset: b;

    li {
      position: relative;
      padding-left: simple();
      margin-bottom: quarter();
      margin-left: 0;

      &::before {
        position: absolute;
        left: quarter('-');
        width: simple();
        color: color(gray4);
        text-align: right;
        content: counters(b, '.') ' ';
        counter-increment: b;
      }
    }
  }

  ul {
    list-style: none;

    li {
      position: relative;
      padding-left: simple();
      margin-bottom: quarter();
      margin-left: 0;

      &::before {
        position: absolute;
        top: 11px;
        left: 14px;
        display: block;
        width: 6px;
        height: 6px;
        text-align: right;
        content: '';
        background-color: color(gray4);
        border-radius: 3px;
      }
    }
  }

  /*
  * The container
  */
  .task-list-item {
    position: relative;
    padding-left: 0;

    &::before {
      display: none;
    }
  }

  /*
  * Hide the browser's default checkbox
  */
  .task-list-item input {
    position: absolute;
    top: quarter('-');
    left: quarter('-');
    z-index: 10;
    width: size(1.5);
    height: size(1.5);
    margin: 0;
    cursor: pointer;
    opacity: 0;
  }

  /*
  * Label Style
  */
  .task-list-item label {
    position: relative;
    padding-left: simple();
    margin-bottom: 0;
    outline: none;
  }

  /*
  * Checkbox aspect
  */
  .task-list-item label::before {
    position: absolute;
    top: 5px;
    left: 0;
    width: 18px;
    height: 18px;
    content: '';
    background-color: color(gray7);
    border-radius: 3px;
    outline: 0;
    box-shadow: 0 0 0 1px rgba(1, 1, 1, 0.12), 0 1px 2px 0 rgba(1, 1, 1, 0.1);
    transition: all 0.2s;
  }

  /*
  * Checked mark aspect
  */
  .task-list-item label::after {
    position: absolute;
    top: 6px;
    left: 5px;
    display: block;
    width: 8px;
    height: 12px;
    content: '';
    border: solid color(gray4);
    border-width: 0 3px 3px 0;
    opacity: 0;
    transform: rotate(45deg);
  }

  /*
  * Checked mark aspect changes
  */
  .task-list-item input:checked + label {
    font-style: italic;
    color: color(gray4);
    text-decoration: line-through;
  }

  .task-list-item input:checked + label::after {
    opacity: 1;
  }

  .embed-responsive {
    height: 390px;
    overflow: hidden;
    border: 1px solid color(gray6);
    border-radius: $border-radius;
    box-shadow: 0 5px 10px color(gray6);
  }

  .embed-responsive iframe {
    width: 100%;
  }

  pre[data-lang] {
    padding-right: half();
    border-radius: $border-radius;

    &.hasFile {
      padding-top: size(1.5);

      &::after,
      + .toolbar {
        top: 0.1rem;
      }

      .line-highlight {
        margin-top: 1.25rem;
      }

      .line-numbers-rows {
        top: 2.4rem;
      }

      .file {
        display: block;
      }
    }

    &::after {
      right: 1.6rem;
    }

    .file {
      position: absolute;
      top: 0;
      left: 0;
      display: none;
      width: 100%;
      height: simple();
      padding: 0 half();
      font-family: font-family(base);
      font-size: font-size(small2);
      line-height: simple();
      color: color(gray2);
      background-color: color(gray6);
      border-radius: $border-radius $border-radius 0 0;
    }
  }

  pre[data-lang],
  pre[data-lang] code {
    position: initial !important;
    font-weight: font-weight(normal);
    color: hsl(198, 17%, 38%);
    background: color(gray7);
    border-radius: $border-radius;
  }

  .line-numbers {
    .line-numbers-rows {
      top: 0.7rem;
      left: 0;
      background-color: color(gray7);
      border-right: 1px solid color(border);

      > span::before {
        font-weight: font-weight(light);
        color: color(gray4);
      }
    }
  }

  .line-highlight {
    background: color(brand);
    opacity: 0.1;
  }

  .code-toolbar {
    .toolbar {
      position: absolute;
      top: quarter();
      right: 0;
      opacity: 1;

      .toolbar-item {
        display: block;
      }
    }

    .toolbar a {
      display: block;
      height: simple();
      padding: 0 half();
      font-family: font-family(monospace);
      font-size: 0.6rem;
      font-weight: font-weight(bold);
      line-height: simple();
      color: color(gray4);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      background: none;
      border-radius: 0;
      box-shadow: none;
    }

    .toolbar a.copied {
      position: relative;

      &::after {
        position: absolute;
        right: -2.4rem;
        padding: 0 0.6rem;
        color: color(gray3);
        content: 'Copied!';
        background-color: color(gray5);
        border-radius: 3px;
        opacity: 0;
        transition: 0.3s all;
      }

      &.copied--error::after {
        content: 'Error, try Ctrl + C';
      }

      &.copied--success::after,
      &.copied--error::after {
        right: 2.4rem;
        opacity: 1;
      }
    }

    .toolbar svg {
      display: inline-block;
      width: 18px;
      height: 18px;
      color: inherit;
      vertical-align: -0.2rem;
      fill: currentColor;
      stroke: none;
    }
  }

  .token.cdata,
  .token.comment,
  .token.doctype,
  .token.prolog {
    color: color(gray4); // #dfeffc
  }

  .token.punctuation {
    color: hsl(219, 33%, 65%); // #c0c5ce
  }

  .token.namespace {
    opacity: 0.7;
  }

  .token.boolean,
  .token.number,
  .token.operator {
    color: hsl(14, 61%, 53%); // #d08770
  }

  .token.property {
    color: hsl(40, 91%, 43%); // #ebcb8b
  }

  .token.tag,
  .token.function {
    color: hsl(210, 29%, 53%); // #8fa1b3
  }

  .language-bash .token.function,
  .token.string {
    color: hsl(178, 27%, 55%); // #96b5b4
  }

  .token.selector {
    color: hsl(311, 30%, 53%); // #b48ead
  }

  .token.attr-name {
    color: hsl(14, 61%, 53%); // #d08770
  }

  .language-css .token.string,
  .style .token.string,
  .token.entity,
  .token.url {
    color: hsl(178, 27%, 55%); // #96b5b4
  }

  .token.attr-value,
  .token.control,
  .token.directive,
  .token.keyword,
  .token.unit {
    color: hsl(92, 38%, 45%); // #a3be8c
  }

  .token.atrule,
  .token.regex,
  .token.statement {
    color: hsl(178, 27%, 55%); // #96b5b4
  }

  .token.placeholder,
  .token.variable {
    color: hsl(210, 29%, 53%); // #8fa1b3
  }

  .token.deleted {
    text-decoration: line-through;
  }

  .token.inserted {
    text-decoration: none;
    border-bottom: 1px dotted hsl(220, 33%, 85%); // #eff1f5
  }

  .token.italic {
    font-style: italic;
  }

  .token.plain-text {
    font-weight: 400;
  }

  .token.bold,
  .token.important {
    font-weight: font-weight(bold);
  }

  .token.important {
    color: hsl(354, 52%, 46%); // #bf616a
  }

  .token.entity {
    cursor: help;
  }

  .language-bash .token.keyword,
  .language-bash .token.operator,
  .language-markdown .token.keyword {
    color: color(gray2);
  }

  pre > code.highlight {
    outline: 0.4em solid hsl(354, 52%, 46%); // #bf616a
    outline-offset: 0.4em;
  }
}

.markdownToc {
  margin-top: triple();
  margin-bottom: triple();
  list-style: none;

  &::before {
    display: block;
    margin-bottom: half();
    font-size: font-size(h5);
    font-weight: font-weight(bold);
    color: color(gray2);
    content: 'Tabla de contenidos';
  }

  li {
    padding: 0;
    margin-bottom: 0.2rem;
    margin-left: 0;
  }
}

@include media(screen) {
  .article.article--show-device {
    padding-right: calc(360px + #{double()});
  }
}

@include media(portrait) {
  .article.article--show-device {
    padding-right: simple();
  }

  .article {
    .embed-responsive {
      height: 360px;
    }

    .embed-responsive iframe {
      height: 360px;
    }
  }
}

@include media(palm) {
  .article {
    padding: half();

    h2 {
      padding-top: simple();
      margin-top: double();
      font-size: font-size(h4);
      line-height: line-height(h4);
    }

    h3 {
      font-size: font-size(h5);
      line-height: line-height(h5);
    }

    h4,
    h5,
    h6 {
      font-size: font-size(base);
      line-height: line-height(base);
    }

    .embed-responsive {
      height: 300px;
    }

    .embed-responsive iframe {
      height: 300px;
    }
  }
  .article.article--show-device {
    padding-right: half();
  }
}
</style>

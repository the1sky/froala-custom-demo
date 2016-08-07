{% extends 'layout.swig' %}

{% block content %}
    <div id="froala-editor"></div>
{% endblock %}

{% block css%}
  <link rel="stylesheet" href="/css/font-awesome.min.css" />
  <link rel="stylesheet" href="/css/froala_editor.min.css" />
  <link rel="stylesheet" href="/css/froala_style.min.css" />
  <link rel="stylesheet" href="/css/jquery.atwho.min.css" />
  <link rel="stylesheet" href="/css/plugins/image.css">
{% endblock %}

{% block js %}
  <script type="text/javascript" src="/js/jquery.2.js"></script>
  <script type="text/javascript" src="/js/froala_editor.min.js"></script>
  <script type="text/javascript" src="/js/jquery.atwho.min.js"></script>


  <script type="text/javascript" src="/js/plugins/image.min.js"></script>
  <script type="text/javascript" src="/js/plugins/image_custom.js"></script>
  <script type="text/javascript" src="/js/plugins/at.js"></script>

  <script type="text/javascript" src="/js/languages/zh_cn.js"></script>

  <script type="text/javascript" src="/js/jquery.storageapi.min.js"></script>
  <script type="text/javascript" src="/js/app.js"></script>

{% endblock %}

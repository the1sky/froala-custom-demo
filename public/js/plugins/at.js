/**
 * Created by nant on 16/8/4.
 */

$.FroalaEditor.DefineIcon('at', {NAME: 'at'});
$.FroalaEditor.RegisterCommand('at', {
  title: '@',
  focus: true,
  undo: true,
  refreshAfterCallback: true,
  callback: function () {
    this.html.insert(' @');
    console.log(this.save);
    var event = new Event('keydown');
    event.which = '13';
  }
});

$(document).ready(function() {
  $('#delete-article').on('click', function(e) {
    e.preventDefault();

    const elementId = $(this).attr('data-id');

    // Send a DELETE request to the server
    $.ajax({
      type: 'DELETE',
      url: '/delete/' + elementId,
      success: function(response) {
        alert('Article deleted successfully');
        window.location.href = '/articles/'  ;
      },
      error: function(err) {
        console.log(err);
        alert('Failed to delete article');
      }
    });
  });
});

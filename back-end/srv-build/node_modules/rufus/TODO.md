## What need to fix

1. Correctly remove rotated files
2. Create folders for file handler
3. Move files not rename in rotating handler

## What need to add

1. socket handler (consist from 4 parts: server which push logs from connected clients and client which push logs to server which connected)
2. smtp handler (without grouping and filtering useless)
3. json formatter (why not just replace bunyan if i can)

Both should collect messages in buffer maybe with support of grouping by specific thing
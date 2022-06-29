import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  UploadedFiles,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Controller('images')
export class ImagesController {
  constructor(private readonly imagesService: ImagesService) {}

  @Post('upload-file')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Post('store-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './files',
        filename: (req, file, callback) => {
          const fileExtName = extname(file.originalname);
          const fileName = uuidv4();
          callback(null, `${fileName}${fileExtName}`);
        },
      }),
    }),
  )
  storeFile(@UploadedFile() file: Express.Multer.File) {
    console.log(file);
    return file;
  }

  @Post('store-files')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'file1',
          maxCount: 1,
        },
        {
          name: 'file2',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          destination: './files',
          filename: (req, file, callback) => {
            const fileExtName = extname(file.originalname);
            const fileName = uuidv4();
            callback(null, `${fileName}${fileExtName}`);
          },
        }),
      },
    ),
  )
  storeFiles(
    @UploadedFiles()
    files: {
      file1?: Express.Multer.File[];
      file2?: Express.Multer.File[];
    },
  ) {
    console.log(files);
    return files;
  }
}

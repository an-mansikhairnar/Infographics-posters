'use client';
import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddArticleForm from '@/app/components/AddArticleForm/AddArticleForm';
import SocialFieldsForm from '@/app/components/SocialFieldsForm/SocialFieldsForm';
import MetaForm from '@/app/components/MetaForm/MetaForm';
import UploadImageForm from '@/app/components/UploadImageForm/UploadImageForm';
import ArticleListTable from '@/app/components/ArticleList/ArticleList';
import { Article, ArticleFormData } from '@/app/interfaces/ArticleFormData';
import { MetaFormData } from '@/app/interfaces/MetaFormData';
import { SocialFieldsFormData } from '@/app/interfaces/SocialFieldsForm';
import { UploadImageFormData } from '@/app/interfaces/UploadImageFormData';
import { toast } from 'react-hot-toast';
import { COLORS } from '../theme';

interface EmbededCodeData {
    embedCode: string;
}

const articlesFormData: ArticleFormData = {
    title: '',
    alias: '',
    catId: '',
    featured: '',
    type: '',
    status: '',
    introDescription: '',
    fullDescription: '',
    authorEmail: '',
    paypalId: ''
};

const metasFormData: MetaFormData = {
    metaTitle: '',
    metaKey: '',
    metaDescription: ''
};

const socialsFieldsFormData: SocialFieldsFormData = {
    authorUrl: '',
    author: '',
    facebook: '',
    facebookUrl: '',
    instagram: '',
    instagramUrl: '',
    twitter: '',
    twitterUrl: ''
};

const uploadImagesFormData: UploadImageFormData = {
    imgFolder: 'IP4001-IP4500',
    fullImageUrl: '',
    thumbImageUrl: '',
    imageAltText: '',
    fullImageFile: null,
    thumbImageFile: null
};

export default function ArticlePage() {
    const [open, setOpen] = useState(false);
    const [editingArticle, setEditingArticle] = useState<Article | null>(null);
    const [articleFormData, setArticleFormData] = useState<ArticleFormData>(articlesFormData);
    const [metaFormData, setMetaFormData] = useState<MetaFormData>(metasFormData);
    const [socialFieldsFormData, setSocialFieldsFormData] = useState<SocialFieldsFormData>(socialsFieldsFormData);
    const [uploadImageFormData, setUploadImageFormData] = useState<UploadImageFormData>(uploadImagesFormData);
    const [embededCode, setEmbededCodeData] = useState<EmbededCodeData>({ embedCode: '' });
    const [refreshArticles, setRefreshArticles] = useState(0);

    const resetForm = () => {
        setArticleFormData(articlesFormData);
        setMetaFormData(metasFormData);
        setSocialFieldsFormData(socialsFieldsFormData);
        setUploadImageFormData(uploadImagesFormData);
        setEmbededCodeData({ embedCode: '' });
    };

    const handleOpen = () => {
        setEditingArticle(null);
        resetForm();
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setEditingArticle(null);
        resetForm();
    };

    const formValidation = () => {
        const isArticleValid =
            articleFormData.title &&
            articleFormData.alias &&
            articleFormData.catId &&
            articleFormData.featured &&
            articleFormData.type &&
            articleFormData.status &&
            articleFormData.introDescription &&
            articleFormData.fullDescription &&
            (articleFormData.type !== 'paid' || articleFormData.authorEmail);

        if (!isArticleValid) {
            toast.error('Please fill all mandatory fields.');
            return;
        }

        const isImageValid =
            uploadImageFormData.imgFolder &&
            uploadImageFormData.imageAltText &&
            (uploadImageFormData.fullImageFile || uploadImageFormData.fullImageUrl) &&
            (uploadImageFormData.thumbImageFile || uploadImageFormData.thumbImageUrl);

        if (!isImageValid) {
            toast.error('Please fill all mandatory fields.');
            return;
        }

        const isSocialValid = socialFieldsFormData.authorUrl;

        if (!isSocialValid) {
            toast.error('Please fill all mandatory fields.');
            return;
        }

        return true;
    };
    const handleAdd = async () => {
        try {
            if (!formValidation()) {
                return;
            }
            let fullImageUrl = '';
            let thumbImageUrl = '';

            // Upload Images
            if (uploadImageFormData.fullImageFile || uploadImageFormData.thumbImageFile) {
                const imageFormData = new FormData();

                imageFormData.append('imgFolder', uploadImageFormData.imgFolder);

                if (uploadImageFormData.fullImageFile) {
                    imageFormData.append('fullImageFile', uploadImageFormData.fullImageFile);
                }

                if (uploadImageFormData.thumbImageFile) {
                    imageFormData.append('thumbImageFile', uploadImageFormData.thumbImageFile);
                }

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-image`, {
                    method: 'POST',
                    body: imageFormData
                });

                if (!uploadRes.ok) {
                    throw new Error('Image upload failed');
                }

                const uploadData = await uploadRes.json();

                fullImageUrl = uploadData.fullImageUrl || fullImageUrl;
                thumbImageUrl = uploadData.thumbImageUrl || thumbImageUrl;
            }

            // Merge all form data
            const combinedData = {
                ...articleFormData,
                ...metaFormData,
                ...socialFieldsFormData,
                ...uploadImageFormData,
                ...embededCode,
                imageAltText: uploadImageFormData.imageAltText.trim().replace(/\s+/g, '-'),
                imgPrefix: process.env.NEXT_PUBLIC_BASE_URL,
                fullImageUrl,
                thumbImageUrl
            };

            // Save Article
            const articleRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(combinedData)
            });

            const result = await articleRes.json();

            if (!articleRes.ok) {
                throw new Error(result.message || 'Failed to save article');
            }

            toast.success('Article added successfully');

            setRefreshArticles((prev) => prev + 1);
            setOpen(false);
            setEditingArticle(null);
        } catch (error) {
            console.error('handleAdd error:', error);
            toast.error('Something went wrong');
        }
    };

    const patchArticleData = (article: Article) => {
        // Article Form
        setArticleFormData({
            title: article.title ?? '',
            alias: article.alias ?? '',
            catId: String(article.catId ?? ''),
            featured: article.featured === '1' ? 'Yes' : 'No',
            type: article.type ?? '',
            status: article.status === 1 ? 'Yes' : 'No',
            introDescription: article.introDescription ?? '',
            fullDescription: article.fullDescription ?? '',
            authorEmail: article.authorEmail ?? '',
            paypalId: article.paypalId ?? ''
        });

        // Meta Form
        setMetaFormData({
            metaTitle: article.metaTitle ?? '',
            metaKey: article.metaKey ?? '',
            metaDescription: article.metaDescription ?? ''
        });

        // Social Form
        setSocialFieldsFormData({
            author: article.author ?? '',
            authorUrl: article.authorUrl ?? '',
            facebook: article.facebook ?? '',
            facebookUrl: article.facebookUrl ?? '',
            instagram: article.instagram ?? '',
            instagramUrl: article.instagramUrl ?? '',
            twitter: article.twitter ?? '',
            twitterUrl: article.twitterUrl ?? ''
        });

        // Upload Image Form
        setUploadImageFormData({
            imgFolder: article.imgFolder ?? '',
            fullImageUrl: article.fullImageUrl ?? '',
            thumbImageUrl: article.thumbImageUrl ?? '',
            imageAltText: article.imageAltText ?? '',
            fullImageFile: null,
            thumbImageFile: null
        });

        // Embed Code
        setEmbededCodeData({
            embedCode: article.embedCode ?? ''
        });
    };

    const handleEditClick = async (id: number) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles/${id}`);

            if (!response.ok) throw new Error('Failed to fetch article');
            const article: Article = await response.json();
            console.log('fullImageUrl:', article.fullImageUrl);
            console.log('thumbImageUrl:', article.thumbImageUrl);
            console.log('imgPrefix:', article.imgPrefix);
            patchArticleData(article);
            setEditingArticle(article);
            setOpen(true);

            patchArticleData(article);
            setEditingArticle(article);
            setOpen(true);
        } catch (error) {
            console.error(error);
        }
    };

    const handleUpdate = async () => {
        if (!editingArticle) return;
        try {
            if (!formValidation()) {
                return;
            }
            let fullImageUrl = editingArticle.fullImageUrl ?? uploadImageFormData.fullImageUrl ?? '';
            let thumbImageUrl = editingArticle.thumbImageUrl ?? uploadImageFormData.thumbImageUrl ?? '';

            // Upload Images
            if (uploadImageFormData.fullImageFile || uploadImageFormData.thumbImageFile) {
                const imageFormData = new FormData();

                imageFormData.append('imgFolder', uploadImageFormData.imgFolder);

                if (uploadImageFormData.fullImageFile) {
                    imageFormData.append('fullImageFile', uploadImageFormData.fullImageFile);
                }

                if (uploadImageFormData.thumbImageFile) {
                    imageFormData.append('thumbImageFile', uploadImageFormData.thumbImageFile);
                }

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-image`, {
                    method: 'POST',
                    body: imageFormData
                });

                if (!uploadRes.ok) {
                    throw new Error('Image upload failed');
                }

                // const uploadData = await uploadRes.json();

                // fullImageUrl = uploadData.fullImageUrl || fullImageUrl;
                // thumbImageUrl = uploadData.thumbImageUrl || thumbImageUrl;
                const uploadData = await uploadRes.json();

                console.log('img path (raw response from /api/upload-image):', uploadData);

                const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? '';

                fullImageUrl = uploadData.fullImageUrl ? `${BASE_URL}${uploadData.fullImageUrl}` : fullImageUrl;

                thumbImageUrl = uploadData.thumbImageUrl ? `${BASE_URL}${uploadData.thumbImageUrl}` : thumbImageUrl;

                console.log('img path (after upload, before combinedData):', { fullImageUrl, thumbImageUrl });
            }

            const combinedData = {
                ...articleFormData,
                ...metaFormData,
                ...socialFieldsFormData,
                ...uploadImageFormData,
                ...embededCode,
                imageAltText: uploadImageFormData.imageAltText.trim().replace(/\s+/g, '-'),
                imgPrefix: process.env.NEXT_PUBLIC_BASE_URL,
                fullImageUrl,
                thumbImageUrl
            };
            console.log('🚀 ~ page.tsx:334 ~ handleUpdate ~ combinedData:', combinedData);

            if (uploadImageFormData.fullImageFile || uploadImageFormData.thumbImageFile) {
                const imageFormData = new FormData();
                imageFormData.append('imgFolder', uploadImageFormData.imgFolder);
                if (uploadImageFormData.fullImageFile)
                    imageFormData.append('fullImageFile', uploadImageFormData.fullImageFile);
                if (uploadImageFormData.thumbImageFile)
                    imageFormData.append('thumbImageFile', uploadImageFormData.thumbImageFile);

                const uploadRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/upload-image`, {
                    method: 'POST',
                    body: imageFormData
                });
                if (!uploadRes.ok) throw new Error('Image upload failed');
            }

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/articles/${editingArticle.articleId}`,
                {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(combinedData)
                }
            );

            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'Update failed');
            toast.success('Article updated successfully');

            setRefreshArticles((prev) => prev + 1);
            setOpen(false);
            setEditingArticle(null);
        } catch (error) {
            console.error('handleUpdate error:', error);
            toast.error('Failed to update article');
        }
    };

    return (
        <>
            <div className="flex justify-between items-center px-2 py-2 border bg-white border-gray-300 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold text-gray-800">Article List</h2>

                <button
                    className="text-white px-4 py-2 rounded-md transition-colors duration-300"
                    style={{ backgroundColor: COLORS.primary }}
                    onClick={handleOpen}
                >
                    Add Article
                </button>
            </div>

            <ArticleListTable onEdit={handleEditClick} refreshKey={refreshArticles} />

            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth scroll="paper">
                <DialogTitle
                    sx={{
                        bgcolor: COLORS.primary,
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                    }}
                    className="!text-white"
                >
                    {editingArticle ? 'Update Article' : 'Add Article'}

                    <IconButton onClick={handleClose} className="!text-white">
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers>
                    <div className="grid grid-cols-2 gap-6 mt-2">
                        <div>
                            <AddArticleForm value={articleFormData} onDataChange={setArticleFormData} />
                            <SocialFieldsForm value={socialFieldsFormData} onDataChange={setSocialFieldsFormData} />
                        </div>
                        <div>
                            <UploadImageForm value={uploadImageFormData} onDataChange={setUploadImageFormData} />
                            <MetaForm value={metaFormData} onDataChange={setMetaFormData} />
                        </div>
                    </div>

                    <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4" style={{ backgroundColor: COLORS.primary }}>
                            <h1 className="text-white text-lg text-sm">Embed Code</h1>
                        </div>
                        <form className="px-6 py-6 space-y-5" onSubmit={(e) => e.preventDefault()}>
                            <input
                                type="text"
                                name="embedCode"
                                placeholder="Embed Code"
                                value={embededCode?.embedCode || ''}
                                onChange={(e) => setEmbededCodeData({ embedCode: e.target.value })}
                                className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                            />
                        </form>
                    </div>
                </DialogContent>

                <DialogActions sx={{ bgcolor: COLORS.primary }}>
                    <Button
                        variant="contained"
                        className="!bg-white hover:!bg-white"
                        sx={{
                            color: COLORS.primary,
                            '&:hover': {
                                color: COLORS.primary
                            }
                        }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>

                    <Button
                        variant="contained"
                        className="!bg-white hover:!bg-white"
                        sx={{
                            color: COLORS.primary,
                            '&:hover': {
                                color: COLORS.primary
                            }
                        }}
                        onClick={editingArticle ? handleUpdate : handleAdd}
                    >
                        {editingArticle ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

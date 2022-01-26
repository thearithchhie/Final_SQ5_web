<?php

namespace App\Http\Controllers\FrontEnd;

use Flash;
use App\Models\Category;
use Illuminate\Http\Request;
use App\Repositories\FaqRepository;
use App\Http\Controllers\Controller;
use App\Repositories\CustomFieldRepository;
use App\Repositories\FaqCategoryRepository;
use Prettus\Repository\Criteria\RequestCriteria;
use InfyOm\Generator\Criteria\LimitOffsetCriteria;
use Prettus\Repository\Exceptions\RepositoryException;

class FaqController extends Controller
{
    /** @var  FaqRepository */
    private $faqRepository;

    /**
     * @var CustomFieldRepository
     */
    private $customFieldRepository;

    /**
     * @var FaqCategoryRepository
     */
    private $faqCategoryRepository;

    public function __construct(FaqRepository $faqRepo, CustomFieldRepository $customFieldRepo, FaqCategoryRepository $faq_categoryRepo)
    {
        parent::__construct();
        $this->faqRepository = $faqRepo;
        $this->customFieldRepository = $customFieldRepo;
        $this->faqCategoryRepository = $faq_categoryRepo;
    }

    /**
     * Display a listing of the Faq.
     * GET|HEAD /faqs
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $this->faqRepository->pushCriteria(new RequestCriteria($request));
            $this->faqRepository->pushCriteria(new LimitOffsetCriteria($request));
        } catch (RepositoryException $e) {
            return $this->sendError($e->getMessage());
        }
        $data['faqs'] = $this->faqRepository->with("faqCategory")->get();
        $data['faqCategories'] = $this->faqCategoryRepository->with('faqs')->get();
        return view('frontend.faq.index', $data);
    }
}

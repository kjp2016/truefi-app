# v1TrueFi/app/truefi_agent.py
import os
import re
import uuid
import logging
from datetime import datetime, UTC, date # Ensure date is imported
from dateutil.relativedelta import relativedelta
from decimal import Decimal
from typing import Optional, Any, List, Dict # Ensure these are here

# --- External Libraries Imports (Copied from your MVPGitLab526.py) ---
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI, OpenAIEmbeddings
from langchain_community.vectorstores import Chroma
from chromadb.config import Settings as ChromaSettings 
from langchain_community.document_loaders import PyPDFLoader
from langchain.memory import ConversationBufferMemory
from langchain.agents import Tool, AgentExecutor, create_openai_functions_agent
from langchain.tools import tool
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import RetrievalQA
from langchain_community.utilities import SQLDatabase
from langchain_community.tools import QuerySQLDatabaseTool
from langchain.prompts import ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate, MessagesPlaceholder
from langchain_core.documents import Document
from .api_models import ChatResponse, RichContentData




# --- Get a logger for this module ---
# When this module is imported, this will create a logger named 'app.truefi_agent'
# if your main logging config uses %(name)s or %(module)s
logger = logging.getLogger(__name__)

# --- Configuration Section (Moved from MVPGitLab526.py) ---
# Determine the project root directory (v1TrueFi)
# __file__ is the path to the current file (truefi_agent.py)
# os.path.dirname(__file__) is app/
# os.path.dirname(os.path.dirname(__file__)) is v1TrueFi/
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Load .env file from the project root
dotenv_path = os.path.join(PROJECT_ROOT, '.env')
if os.path.exists(dotenv_path):
    load_dotenv(dotenv_path=dotenv_path)
    logger.info(f".env file loaded from: {dotenv_path}")
else:
    logger.warning(f".env file not found at: {dotenv_path}. Relying on environment variables directly.")


OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY")
if not OPENAI_API_KEY: # Check if it's None or empty string
    # In a production app, you might raise an error or have a more robust config loading
    logger.critical("OPENAI_API_KEY is not set in environment variables or .env file.")
    # For now, we'll let it proceed, but OpenAI calls will fail.
    # Consider: raise ValueError("CRITICAL: OPENAI_API_KEY is not configured.")
# LangChain will pick up OPENAI_API_KEY from os.environ if set.
# If you set it with os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY, ensure it's not None.
if OPENAI_API_KEY:
    os.environ["OPENAI_API_KEY"] = OPENAI_API_KEY
else: # If you want to strictly require it:
    raise ValueError("OPENAI_API_KEY must be set in your environment or .env file.")


# Document paths are now relative to PROJECT_ROOT
DOCUMENT_PATHS = [
    os.path.join(PROJECT_ROOT, "data/finance_docs/lifetime-financial-advice.pdf"),
    os.path.join(PROJECT_ROOT, "data/finance_docs/Alex Carter Life Story.pdf")
]
DATABASE_URI = os.environ.get("DATABASE_URI")
if not DATABASE_URI:
    raise ValueError("DATABASE_URI must be set in your environment or .env file.")

CHROMA_DOC_PERSIST_DIR = os.path.join(PROJECT_ROOT, "data/chroma_docs_db")
SCENARIO_MEMORY_PERSIST_DIR = os.path.join(PROJECT_ROOT, "data/scenario_memory_db")
os.makedirs(CHROMA_DOC_PERSIST_DIR, exist_ok=True)
os.makedirs(SCENARIO_MEMORY_PERSIST_DIR, exist_ok=True)

LLM_MODEL_NAME = os.environ.get("LLM_MODEL_NAME", "gpt-4o")
LLM_TEMPERATURE_DEFAULT = float(os.environ.get("LLM_TEMPERATURE_DEFAULT", 0.7))
LLM_TEMPERATURE_SUB_AGENT = float(os.environ.get("LLM_TEMPERATURE_SUB_AGENT", 0.5))

# --- Core Components Initialization (Moved from MVPGitLab526.py) ---
# Global memory for MVP (Alex Carter persona)
memory = ConversationBufferMemory(
    return_messages=True,
    memory_key="chat_history", # This key is used in the agent's prompt
    input_key="input",        # Default input key
    output_key="output"       # Default output key
)
logger.info("Global ConversationBufferMemory initialized for agent in truefi_agent.py.")

embedding_model = OpenAIEmbeddings() # API key is read from environment

loaded_docs = []
for path in DOCUMENT_PATHS:
    if os.path.exists(path):
        try:
            loaded_docs.extend(PyPDFLoader(path).load())
            logger.info(f"Successfully loaded document: {path}")
        except Exception as e:
            logger.error(f"Error loading document {path}: {e}. Skipping document.")
    else:
        logger.warning(f"Document not found: {path}. Skipping.")

if not loaded_docs:
    logger.warning("No documents were loaded. Document-based tools might not function as expected.")

doc_insight_summary = "Document insights are initially unavailable."
pdf_qa_chain = None
retriever = None 
vectorstore = None 

if loaded_docs:
    text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=150)
    document_chunks = text_splitter.split_documents(loaded_docs)
    
    try:
        if not os.path.exists(CHROMA_DOC_PERSIST_DIR) or not os.listdir(CHROMA_DOC_PERSIST_DIR):
            logger.info(f"Creating new ChromaDB for documents at {CHROMA_DOC_PERSIST_DIR}.")
            vectorstore = Chroma.from_documents(document_chunks, embedding_model, persist_directory=CHROMA_DOC_PERSIST_DIR)
        else:
            logger.info(f"Loading existing ChromaDB for documents from {CHROMA_DOC_PERSIST_DIR}.")
            vectorstore = Chroma(persist_directory=CHROMA_DOC_PERSIST_DIR, embedding_function=embedding_model)
        
        if vectorstore:
            retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
            pdf_qa_chain = RetrievalQA.from_chain_type(
                llm=ChatOpenAI(model_name=LLM_MODEL_NAME, temperature=LLM_TEMPERATURE_SUB_AGENT), # Corrected model to model_name
                retriever=retriever,
                return_source_documents=True
            )
            logger.info("Document vectorstore and RetrievalQA chain initialized.")

            if pdf_qa_chain:
                try:
                    insight_prompt_text = (
                        "Summarize the most important financial principles, mindsets, behavioral patterns, "
                        "and life goals described in the documents about Alex Carter. "
                        "Write this as your own knowledge without quoting the documents or mentioning them. "
                        "Express it as context you already understand about Alex Carter."
                    )
                    response = pdf_qa_chain.invoke({"query": insight_prompt_text})
                    doc_insight_summary = response.get("result")
                    if doc_insight_summary:
                        logger.info("Extracted core financial insights from documents.")
                    else:
                        logger.warning("Document insight extraction returned no substantive result.")
                        doc_insight_summary = "No specific insights extracted from documents."
                except Exception as insight_err:
                    logger.error(f"Error during document insight extraction: {insight_err}", exc_info=True)
                    doc_insight_summary = "Failed to extract document insights due to an error."
            else:
                doc_insight_summary = "PDF QA chain not available for insights, summary extraction skipped."
        else:
            doc_insight_summary = "Vectorstore initialization failed; insights unavailable."
            logger.error("Vectorstore initialization failed. Document features will be unavailable.")
    except Exception as e:
        logger.error(f"Failed to initialize document processing system: {e}.", exc_info=True)
        doc_insight_summary = "Document system initialization failed; insights unavailable."
        vectorstore = None 
        pdf_qa_chain = None
        retriever = None
else:
    logger.warning("No document chunks to process. Document features will be unavailable.")
    doc_insight_summary = "No documents were loaded; insights unavailable."
    vectorstore = None
    pdf_qa_chain = None
    retriever = None

scenario_memory_db = None
chroma_db_settings = ChromaSettings(
    persist_directory=SCENARIO_MEMORY_PERSIST_DIR,
    anonymized_telemetry=False
)
try:
    logger.info(f"Initializing ChromaDB for scenario memory: {SCENARIO_MEMORY_PERSIST_DIR}.")
    scenario_memory_db = Chroma(
        collection_name="scenario_memory_collection",
        persist_directory=SCENARIO_MEMORY_PERSIST_DIR,
        embedding_function=embedding_model,
        client_settings=chroma_db_settings
    )
    if scenario_memory_db._collection.count() == 0:
        logger.info("Scenario memory DB is new/empty. Adding initial log.")
        scenario_memory_db.add_texts(
            ["Initial scenario memory log entry."],
            metadatas=[{"type": "system_init", "timestamp": datetime.now(UTC).isoformat()}]
        )
    logger.info("Scenario memory ChromaDB initialized.")
except Exception as e:
    logger.error(f"Failed to initialize scenario memory ChromaDB: {e}.", exc_info=True)
    scenario_memory_db = None

db_instance = None
sql_query_tool = None
try:
    db_instance = SQLDatabase.from_uri(DATABASE_URI)
    if db_instance.get_usable_table_names():
        logger.info(f"Connected to PostgreSQL. Usable tables: {db_instance.get_usable_table_names()}")
    else:
        logger.warning("Connected to PostgreSQL, but no usable tables found.")
    sql_query_tool = QuerySQLDatabaseTool(db=db_instance, description="Query Alex Carter's financial records using SQL...")
except Exception as e:
    logger.error(f"Error connecting to database: {e}. SQL tools disabled.", exc_info=True)
    sql_query_tool = Tool(
        name="sql_db_query_unavailable",
        func=lambda x: "Database offline. Cannot query records.",
        description="SQL database offline. Cannot query records."
    )

# --- Helper Functions (Moved from MVPGitLab526.py) ---
def log_full_conversation_turn(conversation_id: str, turn_number: int, user_input: str, ai_response: str):
    if scenario_memory_db is None:
        logger.warning("Log_full_turn: Scenario DB not available. Skipping logging.")
        return
    timestamp = datetime.now(UTC).isoformat()
    content = f"User Turn {turn_number}: {user_input}\nAI Response: {str(ai_response)}"
    doc_id = f"conv_{conversation_id}_turn_{turn_number}"
    doc = Document(page_content=content, metadata={
        "type": "full_conversation_turn", "conversation_id": conversation_id,
        "turn_number": turn_number, "timestamp": timestamp,
        "user_input_preview": user_input[:100].replace('\n', ' ').strip(),
        "ai_response_preview": str(ai_response)[:100].replace('\n', ' ').strip()
    })
    try:
        scenario_memory_db.add_documents([doc], ids=[doc_id])
        logger.debug(f"Logged turn {turn_number} to scenario memory (ID: {doc_id})")
    except Exception as e:
        logger.error(f"Failed to log full turn to scenario memory: {e}", exc_info=True)

def maybe_log_scenario(user_input: str, response: str, conversation_id: str):
    if scenario_memory_db is None:
        logger.warning("Maybe_log_scenario: Scenario DB not available. Skipping logging.")
        return
    financial_keywords = ["retirement", "car", "house", "family", "rent vs buy", "net worth", "wedding", "budget", "goal", "expense", "plan", "invest", "debt", "loan", "asset", "liability", "income", "mortgage", "saving"]
    if any(kw in user_input.lower() for kw in financial_keywords):
        timestamp = datetime.now(UTC).isoformat()
        topic_for_log = user_input[:50].replace('\n', ' ').strip()
        if len(topic_for_log) == 50: topic_for_log += "..."
        doc_id = f"scenario_{conversation_id}_{timestamp.replace(':','-').replace('.','-')}"
        doc_content = f"User: {user_input}\nAI: {str(response)}"
        doc = Document(page_content=doc_content, metadata={
            "type": "financial_scenario_summary", "topic": topic_for_log,
            "timestamp": timestamp, "conversation_id": conversation_id
        })
        try:
            scenario_memory_db.add_documents([doc], ids=[doc_id])
            logger.debug(f"Logged scenario: '{topic_for_log}' (ID: {doc_id}).")
        except Exception as e:
            logger.error(f"Failed to log scenario: {e}", exc_info=True)

def inject_context(user_input: str) -> str:
    if scenario_memory_db is None:
        logger.warning("Inject_context: Scenario DB not available. Skipping context injection.")
        return user_input
    try:
        results = scenario_memory_db.similarity_search_with_score(user_input, k=3)
    except Exception as e:
        logger.error(f"Error in inject_context similarity search: {e}", exc_info=True)
        return user_input
    related_context = []
    score_threshold = 1.0 
    emotion_keywords = {
        "can't afford": "Financial hesitation", "too expensive": "Price concern",
        "delayed": "Patience/Waiting", "saving up": "Disciplined saving",
        "fomo": "Fear of missing out", "nervous": "Emotional sensitivity",
        "confident": "Confidence", "excited": "Excitement", "impulsive": "Impulsiveness",
        "worried": "Anxiety/Concern", "unsure": "Uncertainty", "stuck": "Feeling blocked"
    }
    added_emotional_signals = set()
    for doc, score in results:
        if score < score_threshold: 
            doc_text_lower = doc.page_content.lower()
            timestamp_short = doc.metadata.get('timestamp', 'N/A')[:10]
            emotional_signal_added_for_this_doc = False
            for trigger, label in emotion_keywords.items():
                if trigger in doc_text_lower and label not in added_emotional_signals:
                    related_context.append(f"- 💬 Emotional signal: **{label}** (context: {timestamp_short})")
                    added_emotional_signals.add(label)
                    emotional_signal_added_for_this_doc = True; break 
            if doc.metadata.get("type") == "full_conversation_turn":
                turn_num = doc.metadata.get('turn_number', 'N/A')
                user_preview = doc.metadata.get('user_input_preview', 'N/A')
                ai_preview = doc.metadata.get('ai_response_preview', 'N/A')
                related_context.append(f"- Past Turn ({turn_num} on {timestamp_short}): User: \"{user_preview}\" | Penny: \"{ai_preview}\"")
            elif doc.metadata.get("type") == "financial_scenario_summary":
                topic = doc.metadata.get('topic', 'N/A')
                content_preview = doc.page_content[:150].replace('\n', ' ').strip()
                related_context.append(f"- Scenario: \"{topic}\" ({timestamp_short}) — \"{content_preview}...\"")
            elif not emotional_signal_added_for_this_doc: 
                content_preview = doc.page_content[:150].replace('\n', ' ').strip()
                related_context.append(f"- Context ({timestamp_short}): \"{content_preview}...\"")
    if related_context:
        unique_contexts = []
        seen_content_snippets = set()
        for context_line in related_context:
            snippet = context_line[:100] 
            if snippet not in seen_content_snippets:
                unique_contexts.append(context_line); seen_content_snippets.add(snippet)
        if not unique_contexts: return user_input 
        memory_text = "\n".join(unique_contexts)
        logger.info(f"Injecting {len(unique_contexts)} relevant past contexts into user input.")
        return f"Relevant context from Alex's past interactions (please consider this in your response):\n{memory_text}\n\nUser's current question: {user_input}"
    return user_input

def clean_math_format(equation_steps: list[str], conclusion: str = "") -> str:
    formatted = "```\n"
    for step in equation_steps:
        formatted += step + "\n"
    if conclusion:
        formatted += f"\nSo the final result is: {conclusion}\n"
    formatted += "```"
    return formatted




# --- Tool Definitions (Moved from MVPGitLab526.py) ---
# Ensure these are defined before initialize_penny_agent is called.

@tool
def calculate_roi(investment: float, return_amount: float) -> str:
    """
    Calculates the Return on Investment (ROI) as a percentage.
    This tool returns the calculation in a clear, handwritten-math style format.
    Input: investment (initial amount) and return_amount (final value).
    """
    if investment == 0:
        logger.warning("Attempted ROI calculation with zero investment, which is mathematically undefined.")
        return "Error: Investment cannot be zero for ROI calculation. Please provide a non-zero investment amount."

    try:
        investment_dec = Decimal(str(investment))
        return_dec = Decimal(str(return_amount))
        roi = ((return_dec - investment_dec) / investment_dec) * Decimal(100)

        equation_steps = [
            "ROI = ((Return - Investment) ÷ Investment) × 100",
            f"ROI = (({return_dec} - {investment_dec}) ÷ {investment_dec}) × 100",
            f"ROI = ({return_dec - investment_dec} ÷ {investment_dec}) × 100",
            f"ROI = {((return_dec - investment_dec) / investment_dec):.4f} × 100",
            f"ROI = {roi:.2f}%"
        ]

        return clean_math_format(equation_steps, f"ROI = {roi:.2f}%")

    except Exception as e:
        logger.error(f"Error during ROI calculation: {e}", exc_info=True)
        return f"An error occurred while calculating ROI: {e}"


@tool
def budget_assistant(income: float, expenses: float) -> str:
    """Computes the net budget (income minus expenses) and determines if it's a surplus or deficit.
    This tool provides a quick financial snapshot for budgeting purposes, helping Alex understand his cash flow.
    Input: Two floats - `income` (total monthly income) and `expenses` (total monthly expenses).
    Example: `budget_assistant(income=5000, expenses=3000)` would return "Net Budget: $2000.00 (Surplus)".
    """
    try:
        net = Decimal(str(income)) - Decimal(str(expenses))
        status = 'Surplus' if net >= 0 else 'Deficit'
        return f"Net Budget: ${net:.2f} ({status})"
    except Exception as e:
        logger.error(f"Error during budget calculation: {e}", exc_info=True)
        return f"An error occurred while calculating the budget: {e}"

@tool("doc_insight_tool")
def doc_insight_tool(query: str) -> str:
    """Answers questions based on embedded financial documents (e.g., 'lifetime-financial-advice.pdf', 'Alex Carter Life Story.pdf').
    This tool is highly useful for general financial advice, principles, or specific biographical details about Alex Carter
    not found in the structured SQL database. It performs a semantic search over the document knowledge base.
    Input: A natural language query string.
    Example: `doc_insight_tool(query="What are the key principles of effective financial planning?")`
    """
    if pdf_qa_chain is None:
        logger.warning("doc_insight_tool called, but pdf_qa_chain is not available.")
        return "Document insight tool is currently unavailable as the document database could not be loaded or no documents were found."
    try:
        result = pdf_qa_chain.invoke({"query": query})
        answer = result.get('result', "No answer found.")
        return answer
    except Exception as e:
        logger.error(f"Error during document insight retrieval for query '{query}': {e}", exc_info=True)
        return f"An error occurred while retrieving information from documents: {e}"

@tool
def retrieve_scenario_memory(query: str) -> str:
    """Retrieves previously stored financial planning scenarios or full conversation turns based on a query.
    This tool is essential for recalling specific past discussions, hypothetical situations, or entire previous interactions
    that have been logged into Penny's long-term scenario memory (ChromaDB). This helps maintain long-term conversational
    coherence and provides historical context for complex financial discussions.
    Input: A natural language query describing the past scenario or conversation turn to retrieve.
    Example: `retrieve_scenario_memory(query="tell me about the retirement plan we discussed last week")`
    """
    if scenario_memory_db is None:
        logger.warning("retrieve_scenario_memory called, but scenario_memory_db is not available.")
        return "Long-term scenario memory is currently unavailable."
    try:
        results = scenario_memory_db.similarity_search(query, k=5)
    except Exception as e:
        logger.error(f"Error during similarity search in scenario memory for retrieval: {e}", exc_info=True)
        return "An error occurred while searching scenario memory."
        
    if not results:
        return "No similar scenarios or past conversation turns found in memory matching your query."

    formatted_results = []
    for r_idx, r in enumerate(results):
        entry_header = f"Memory Entry {r_idx+1}:\n"
        timestamp_short = r.metadata.get('timestamp', 'N/A')[:19].replace("T", " ")
        content_preview = r.page_content[:300] # Default preview

        if r.metadata.get("type") == "full_conversation_turn":
            conv_id_short = r.metadata.get('conversation_id', 'N/A')[:8]
            turn_num = r.metadata.get('turn_number', 'N/A')
            user_preview = r.metadata.get('user_input_preview', 'N/A')
            ai_preview = r.metadata.get('ai_response_preview', 'N/A')
            formatted_results.append(f"{entry_header}Type: Past Conversation Turn\nID: {conv_id_short}..., Turn: {turn_num}, Time: {timestamp_short}\nUser Preview: {user_preview}\nAI Preview: {ai_preview}\nFull Content Snippet: {content_preview}...")
        elif r.metadata.get("type") == "financial_scenario_summary":
            topic = r.metadata.get('topic', 'N/A')
            formatted_results.append(f"{entry_header}Type: Financial Scenario Summary\nTopic: '{topic}', Time: {timestamp_short}\nContent Snippet: {content_preview}...")
        else:
            formatted_results.append(f"{entry_header}Type: General Log Entry, Time: {timestamp_short}\nContent Snippet: {content_preview}...")
            
    return "Found the following relevant items in long-term memory:\n\n" + "\n\n".join(formatted_results)

@tool
def get_last_ai_output_item(item_reference: str) -> str:
    """
    **CRITICAL TOOL FOR REFERENCING PREVIOUSLY GENERATED NUMBERED LIST ITEMS ONLY.**
    Retrieves a specific numbered item (e.g., "number 7", "point 3", "item 5") from the agent's
    IMMEDIATELY PRECEDING output in the current conversation. This tool is explicitly designed
    to handle direct follow-up questions about numbered lists Penny has just provided.
    This ensures precise and immediate recall of specific points from the ongoing dialogue.
    **DO NOT use this tool for general requests for a number or quantity that requires a new calculation.**
    Input: A string like 'number 7', 'point 3', 'item 5', 'option 2', 'selection 1'.
    Returns: The extracted content of the numbered item, or an informative error message if not found or reference is unclear.
    """
    memory_data = memory.load_memory_variables({})
    chat_history_messages = memory_data.get("chat_history", [])

    if not chat_history_messages:
        logger.warning("get_last_ai_output_item called but no chat history found in current session.")
        return "Error: No recent conversation history found to extract from. I need a previous message to reference."

    last_ai_message_content = None
    for message in reversed(chat_history_messages):
        if hasattr(message, 'type') and message.type == "ai":
            if hasattr(message, 'content'):
                last_ai_message_content = message.content
                break
    
    if not last_ai_message_content:
        logger.warning("get_last_ai_output_item called but no recent AI message content found in history.")
        return "Error: No recent AI message found in my history to extract from. I need a previous message of mine to reference."

    match = re.search(r'(?:number|point|item|option|choice|selection)\s*(\d+)', item_reference.lower())
    if not match:
        logger.warning(f"get_last_ai_output_item called with unclear reference: '{item_reference}'")
        return f"Error: I couldn't understand the item reference '{item_reference}'. Please clearly specify like 'number X', 'point X', or 'item X'."

    item_number_to_find = int(match.group(1))
    if item_number_to_find == 0:
        return f"Error: Item numbers usually start from 1. Please specify a valid item number."

    lines = last_ai_message_content.split('\n')
    extracted_item_full_content = []
    currently_in_target_item = False
    item_prefix_regex = r'^\s*(?:[-*]\s*)?(\d+)\s*[.)]?\s*'

    for line_text in lines:
        item_start_match = re.match(item_prefix_regex + r'(.*)', line_text)
        
        if item_start_match:
            current_item_num_on_line = int(item_start_match.group(1))
            if current_item_num_on_line == item_number_to_find:
                currently_in_target_item = True
                extracted_item_full_content.append(line_text.strip()) 
            elif currently_in_target_item:
                currently_in_target_item = False
                break 
            else:
                currently_in_target_item = False 
        elif currently_in_target_item:
            if line_text.strip(): 
                extracted_item_full_content.append("  " + line_text.strip())

    if extracted_item_full_content:
        full_item_text = "\n".join(extracted_item_full_content)
        logger.info(f"Successfully extracted '{item_reference}' (item {item_number_to_find}) from last AI output: '{full_item_text}'")
        return f"Okay, regarding '{item_reference}' from my previous response, here is that point again:\n\n\"{full_item_text}\"\n\nWhat would you like to discuss further about this specific point?"
    else:
        content_preview = last_ai_message_content[:200].replace('\n', ' ')
        logger.warning(f"Could not find '{item_reference}' (item {item_number_to_find}) as a clearly numbered item in last AI output. Last output started with: '{content_preview}...'")
        # Fix: Move the replace operation outside the f-string
        message_preview = last_ai_message_content[:100].replace('\n', ' ')
        return f"I'm sorry, I couldn't pinpoint item number {item_number_to_find} (from your reference '{item_reference}') as a distinct numbered point in my immediately previous response. My last message started with: \"{message_preview}...\". Could you please clarify or ensure it was a numbered item from that last message?"

@tool
def analyze_large_expense_impact(expense_name: str, expense_amount: float, duration_months: int) -> str:
    """
    Analyzes the financial impact of a large, one-time or short-term recurring expense on Alex's overall financial goals and budget.
    Provides a realistic assessment of affordability by considering current income, expenses, and potentially existing financial goals.
    Calculates how the expense would affect monthly cash flow or require savings.
    
    Input:
    - `expense_name`: The name of the expense (e.g., "wedding", "new car down payment", "vacation").
    - `expense_amount`: The total cost of the expense (float).
    - `duration_months`: The number of months over which the expense needs to be saved for or will be paid out (int). If 1, it's a one-time expense this month.

    Returns: A detailed string explaining the impact.
    """
    if sql_query_tool is None or sql_query_tool.name == "sql_db_query_unavailable":
        logger.warning("analyze_large_expense_impact called, but SQL tool is unavailable.")
        return "Cannot perform detailed expense analysis. Database connection is unavailable, so I can't access Alex's current financial snapshot."

    if duration_months <= 0:
        return "Error: Duration in months must be a positive whole number (e.g., 1 or greater)."
    if expense_amount < 0:
        return "Error: Expense amount cannot be negative."

    analysis_parts = [f"--- Financial Impact Analysis for '{expense_name}' (${expense_amount:,.2f} over {duration_months} months) ---"]
    
    monthly_cost_for_new_expense = Decimal("0.00")
    if expense_amount == 0 and duration_months > 0:
        analysis_parts.append(f"Analyzing impact for '{expense_name}' assuming an initial expense amount of $0.00. If you provide a target amount, I can calculate the required savings.")
    elif duration_months > 0:
        monthly_cost_for_new_expense = Decimal(str(expense_amount)) / Decimal(str(duration_months))
        analysis_parts.append(f"Required monthly financial allocation for '{expense_name}': ${monthly_cost_for_new_expense:,.2f}")
    # No else needed here due to prior duration_months check

    try:
        snapshot_query = """
        SELECT total_income, total_expense, net_savings 
        FROM monthly_snapshots  
        ORDER BY snapshot_month DESC  
        LIMIT 1;
        """
        snapshot_result_str = sql_query_tool.run(snapshot_query)
        logger.info(f"Raw snapshot data from DB for expense analysis: {snapshot_result_str}")

        if not snapshot_result_str or snapshot_result_str.strip().lower() in ("[]", "none", "") or "error" in snapshot_result_str.lower():
            analysis_parts.append("\nCould not retrieve Alex's current financial snapshot from the database. My analysis will be limited to the expense itself.")
            if monthly_cost_for_new_expense > 0:
                 analysis_parts.append(f"Without current financial data, the expense of ${expense_amount:,.2f} for '{expense_name}' means allocating ${monthly_cost_for_new_expense:,.2f} per month for {duration_months} months.")
            return "\n".join(analysis_parts)
            
        snapshot_match = re.search(
            r"\[?\s*\(\s*Decimal\s*\(\s*'([\d\.]+)'\s*\)\s*,\s*Decimal\s*\(\s*'([\d\.]+)'\s*\)\s*,\s*Decimal\s*\(\s*'([\d\.]+)'\s*\)\s*\)\s*\]?",
            snapshot_result_str,
            re.IGNORECASE
        )
        
        if not snapshot_match:
            logger.error(f"Failed to parse financial snapshot data from DB response: '{snapshot_result_str}'.")
            analysis_parts.append(f"\nI had trouble interpreting the financial snapshot data from the database ('{snapshot_result_str[:100]}...'). Analysis will be limited.")
            if monthly_cost_for_new_expense > 0:
                analysis_parts.append(f"The expense of ${expense_amount:,.2f} for '{expense_name}' means allocating ${monthly_cost_for_new_expense:,.2f} per month for {duration_months} months.")
            return "\n".join(analysis_parts)

        current_income = Decimal(snapshot_match.group(1))
        current_total_expenses = Decimal(snapshot_match.group(2))
        current_net_savings = Decimal(snapshot_match.group(3))

        analysis_parts.append(f"\nAlex's Latest Monthly Financial Snapshot:")
        analysis_parts.append(f"  - Total Income: ${current_income:,.2f}")
        analysis_parts.append(f"  - Current Total Routine Expenses: ${current_total_expenses:,.2f}")
        analysis_parts.append(f"  - Current Net Monthly Savings (before this new expense): ${current_net_savings:,.2f}")

        net_savings_after_new_expense = current_net_savings - monthly_cost_for_new_expense
        
        analysis_parts.append(f"\nImpact of '{expense_name}':")
        if monthly_cost_for_new_expense > 0:
            analysis_parts.append(f"  - Monthly allocation for this expense: ${monthly_cost_for_new_expense:,.2f}")
        analysis_parts.append(f"  - Estimated Net Monthly Savings (after this expense): ${net_savings_after_new_expense:,.2f} (for {duration_months} months).")

        if net_savings_after_new_expense < 0:
            analysis_parts.append(f"  - 🔴 **Affordability Warning**: Allocating for '{expense_name}' would result in a monthly deficit of ${abs(net_savings_after_new_expense):,.2f}.")
            analysis_parts.append("     This suggests the expense, as planned, is **not affordable** without reducing other expenses, increasing income, or drawing from existing savings/assets.")
        elif net_savings_after_new_expense < (current_net_savings * Decimal('0.2')):
            analysis_parts.append(f"  - 🟡 **Affordability Caution**: This expense significantly reduces Alex's monthly net savings from ${current_net_savings:,.2f} to ${net_savings_after_new_expense:,.2f}.")
            analysis_parts.append("     While potentially manageable, this will slow down progress on other financial goals. Consider if this trade-off is acceptable.")
        elif monthly_cost_for_new_expense == 0:
             analysis_parts.append(f"  - 🟢 This scenario (with $0 cost for '{expense_name}') doesn't change Alex's current net savings of ${current_net_savings:,.2f}. Please provide a target amount for a full analysis.")
        else:
            analysis_parts.append(f"  - 🟢 **Affordability Outlook**: This expense appears manageable within Alex's current financial situation, reducing net monthly savings to ${net_savings_after_new_expense:,.2f} during the specified period.")

        analysis_parts.append("\n---")
        analysis_parts.append("Note: This analysis primarily shows the impact on monthly cash flow and net savings. It doesn't automatically adjust for drawing from existing capital for this expense unless that's how it's framed. For a full picture, consider how this aligns with Alex's overall net worth and other financial goals.")
        return "\n".join(analysis_parts)

    except Exception as e:
        logger.error(f"Error during large expense impact analysis for '{expense_name}': {e}", exc_info=True)
        return f"I encountered an unexpected error while analyzing the financial impact of '{expense_name}': {e}. I can't provide a detailed breakdown right now. Please ensure the database is accessible and the data format is as expected."

# --- Main Agent Setup ---
def initialize_penny_agent():
    """Initializes and returns the main Penny agent executor."""
    logger.info("Initializing Penny - The AI Financial Copilot Agent...")
    llm = ChatOpenAI(model_name=LLM_MODEL_NAME, temperature=LLM_TEMPERATURE_DEFAULT)  # Fixed parameter
    
    # Ensure all tool functions are defined before this point
    # And that global variables like pdf_qa_chain, scenario_memory_db, sql_query_tool are initialized
    
    tools_list = [
        calculate_roi,
        budget_assistant,
        retrieve_scenario_memory, # Assuming this is defined
        get_last_ai_output_item,
        analyze_large_expense_impact
    ]
    if pdf_qa_chain: 
        tools_list.append(doc_insight_tool)
    else: 
        logger.warning("InitAgent: pdf_qa_chain unavailable, doc_insight_tool not added.")
        
    if sql_query_tool and sql_query_tool.name != "sql_db_query_unavailable": 
        tools_list.append(sql_query_tool)
    elif sql_query_tool: # It's the placeholder tool
        tools_list.append(sql_query_tool) 
        logger.warning("InitAgent: SQL Query Tool is unavailable (using placeholder).")
    else: 
        logger.error("InitAgent: SQL Query Tool is unexpectedly None.")

    system_message_content = """
🔐 System Role: TrueFi WealthGPT — Penny

You are "Penny", an advanced AI-powered financial guide and digital wealth therapist designed for Alex Carter. Penny operates as a humanized, always-on advisor that offers real-time, emotionally intelligent financial planning, powered by TrueFi’s smart wealth infrastructure and data pulled directly from Alex’s financial database.

---
WHO YOU’RE HELPING
Client: Alexander James Carter (Alex)
- Age: 32 | Location: Los Angeles, CA
- Job: Consultant at Deloitte
- Personality: ENTJ — strategic, disciplined, high-growth thinker
- Core Values: Financial independence, efficiency, balance, growth
- Financial Mindset: Structured but adaptable, goal-driven, FOMO-aware but disciplined, stealth-wealth-prioritizing, and risk-balanced
- Relationship: Single, planning for family in 5–10 years
- Income: Salary, Substack, Udemy, Investments
- Goals: Buy Tesla Model Y, grow passive income, retire with $2M by 60, start a family

Psychological Snapshot:
- Risk Tolerance: 8/10
- Confidence in Finances: 7/10
- Spending Style: Conscious
- Time Perspective: Future-Oriented
- Decision Style: Analytical
- Delegation Preference: Moderate
---
WHAT YOU KNOW
You have full access to Alex’s structured SQL database: `truefi_db` (Schema: `public`). All financial values are in **USD ($)** unless specified otherwise via the `currency` column.

### 1. `monthly_snapshots`
| Column            | Meaning |
|-------------------|---------|
| `snapshot_month`  | Month/year of the snapshot (e.g., "2025-03") |
| `total_income`    | Total income for that month in USD |
| `total_expense`   | Total spending for that month in USD |
| `net_savings`     | `total_income - total_expense` in USD |
| `net_worth`       | Total assets minus liabilities in USD |
| `asset_total`     | Current value of all assets in USD |
| `liability_total` | Total liabilities in USD |
**CRITICAL NOTE FOR `monthly_snapshots` QUERIES:** When retrieving the latest monthly data, always use the SQL query `SELECT total_income, total_expense, net_savings FROM monthly_snapshots ORDER BY snapshot_month DESC LIMIT 1;` to ensure you get the most recent complete snapshot. **DO NOT attempt to filter by a specific month string (e.g., `WHERE snapshot_month = '2025-05'`) as this can lead to date format errors.**

### 2. `investments`
| Column            | Meaning |
|-------------------|---------|
| `account_type`    | Investment account (e.g., 401(k), Roth IRA, Brokerage) |
| `asset_name`      | Investment name (e.g., TSLA, Bitcoin) |
| `category`        | Asset class (e.g., ETF, Stock, Crypto) |
| `amount_invested` | Amount invested in USD |
| `current_value`   | Current investment value in USD |
| `risk_rating`     | Risk score from 1–10 |

### 3. `assets`
| Column              | Meaning |
|---------------------|---------|
| `asset_type`        | Type (e.g., Real Estate, Vehicle) |
| `name`              | Name or label of the asset |
| `purchase_value`    | Original purchase value in USD |
| `current_value`     | Current value in USD |
| `appreciation_rate` | Annual growth rate (%) |
| `purchase_date`     | Date of asset acquisition |
| `location`          | Geographic or digital location |
| `notes`             | Optional description or annotation |

### 4. `liabilities`
| Column              | Meaning |
|---------------------|---------|
| `liability_type`    | Loan or debt type (e.g., Mortgage, Credit Card) |
| `institution`       | Financial institution or lender |
| `original_amount`   | Initial value of the loan in USD |
| `remaining_balance` | Current amount owed in USD |
| `interest_rate`     | Annual interest rate (%) |
| `start_date`        | Loan start date |
| `end_date`          | Scheduled end date |
| `payment_due_day`   | Day of month payment is due |

### 5. `transactions`
| Column      | Meaning |
|-------------|---------|
| `txn_type`  | Either "income" or "expense" |
| `vendor`    | Who or where the transaction was with (e.g., Amazon, Acme Corp) |
| `category`  | Category label (e.g., Groceries, Salary, Transportation) |
| `amount`    | Amount of transaction in USD |
| `currency`  | Currency code (default is "USD") |
| `txn_date`  | Date of transaction |
| `notes`     | Optional explanation |
| `created_at`| Timestamp the record was logged |

### 6. `financial_goals`
| Column          | Meaning |
|-----------------|---------|
| `goal_name`     | Name of the goal (e.g., “Tesla Model Y”, “Retirement”) |
| `target_amount` | Goal target in USD |
| `current_saved` | Amount saved so far toward goal |
| `due_date`      | Intended goal deadline |
| `status`        | Status (e.g., "In Progress", "On Track", "Delayed") |
| `notes`         | Free-text note or strategy |
| `created_at`    | Timestamp when goal was created |

### 7. `life_events`
| Column           | Meaning |
|------------------|---------|
| `event_type`     | Event category (e.g., "Promotion", "Purchase") |
| `description`    | What happened and why it matters |
| `event_date`     | When the event occurred |
| `projected_cost` | Estimated or actual cost in USD |
| `impact_summary` | Summary of how it impacted Alex’s finances or goals |

### 8. `psych_profile`
| Column                    | Meaning |
|---------------------------|---------|
| `personality_type`        | MBTI personality type (e.g., ENTJ) |
| `risk_tolerance`          | Risk comfort on a scale from 1 to 10 |
| `financial_style`         | Descriptor of financial behavior (e.g., Conscious Spender) |
| `behavioral_flags`        | Traits like FOMO, Overanalyzing, etc. |
| `core_values`             | Key drivers (e.g., Growth, Freedom) |
| `optimization_preference` | How Alex prioritizes (e.g., Efficiency-first) |
---
PENNY’S CORE RESPONSIBILITIES
1. Personalized Insight Engine: Use real data only. Align suggestions with Alex’s numbers and profile.
2. Goal-Based Decision Support: Budgeting, saving, investing, etc. **For large one-time expenses, ALWAYS use `analyze_large_expense_impact` tool.**
3. Emotionally Intelligent Coaching: Reduce anxiety, support clarity, empower Alex.
4. Scenario Modeling: Test early retirement, savings rates, lifestyle upgrades.
5. Proactive Suggestions: Alert on data patterns suggesting opportunity or risk.
6. Simplification of Complexity: Speak clearly, avoid jargon unless requested.
7. Memory Management:
    - CRITICAL: Remember current conversation via `chat_history`.
    - **ABSOLUTELY CRITICAL FOR LIST ITEM FOLLOW-UPS: IF user references a numbered item from your IMMEDIATE PREVIOUS RESPONSE (e.g., "number 1", "point 3"), MUST FIRST use `get_last_ai_output_item` tool. THEN elaborate. DO NOT answer directly or use other tools unless `get_last_ai_output_item` fails. This is ONLY for existing numbered points, NOT new calculations.**
    - Advanced Memory: Hybrid architectures (short, medium, long-term recall), Knowledge Graph integration.
8. Scenario Recall: Use chat history and stored summaries. If uncertain, present top matches and ask for confirmation.
9. Data Presentation & Visualization:

**Textual Summaries & Markdown Formatting:**
- Always begin with a clear, insightful summary of your reasoning.
- Use Markdown syntax for formatting:
  - Headings: `###`
  - Bold: `**text**`
  - Italics: `*text*`
  - Lists: `- item` or `1. item`
- For tables in plain text responses, format them as clean **Markdown tables** with aligned headers and rows.
- All numerical values must be rounded appropriately and labeled with units (%, $, etc.).

 - **Mathematical Formulas and Equations (LaTeX Formatting REQUIRED):**
     - ALL mathematical formulas, equations, calculations shown step-by-step, or symbolic mathematical expressions MUST be formatted using LaTeX.
     - For **inline mathematics** (math embedded in a sentence), you MUST enclose the entire LaTeX expression in **single dollar signs**. Example:
       `The interest is $I = P \\times r \\times t$.`
     - For **display mathematics** (equations on their own line), you MUST enclose the entire LaTeX expression in **double dollar signs**.
     - **Crucial:** Do NOT use `\\[ ... \\]` or `\\( ... \\)` (with single backslashes) as your primary math delimiters. Only use `$...$` and `$$...$$`.
     - Inside LaTeX math (within `$...$` or `$$...$$`), if you need to display a literal dollar sign for currency, you MUST escape it as `\\$`.
     - Use standard LaTeX commands (ensure backslashes are doubled for Python string literals):
     - Define variables clearly. Example:
       `"Where $P$ is the principal, $r$ is the rate, and $n$ is the term."`

 - **General Text Formatting with Numbers and Currency (Outside of LaTeX math blocks):**
     - Always include spaces around operators like +, -, =, ≈. Example:
       `$100 + $50 = $150`
       NOT: `$100+$50=$150`
     - Ensure spaces between numbers and words. Example:
       `your savings of $500 is significant.`
       NOT: `your saving of$500is significant.`
     - Format currency values in regular text with `$` and commas (e.g., $1,234.56 or $400,000).
     - Do not say "using a LaTex format", "using LateX formula" or "in LaTex format" directly in your response.

10. Proactive, Predictive, & Prescriptive Intelligence: "What If" modeling, anomaly detection/alerts, goal path optimization.
11. Hyper-Personalized Guidance & Nudging: Contextual learning, behavioral economics, gamification.
12. Advanced Conversational Fluency: Complex query handling, summarization & detail on demand.
    - **QUANTITATIVE ANSWERS: For specific numbers/quantities requiring NEW calculation or direct value (e.g., "how much," "what's the total"), MUST use CALCULATION TOOL (`analyze_large_expense_impact`, `budget_assistant`, `calculate_roi`) for a precise, data-driven numerical answer DIRECTLY. `get_last_ai_output_item` is NOT for new calculations.**
13. Empowered Automation (Permission-Based): Pre-authorized workflows, explicitly approved by Alex.
14. Contextual Topic Tracking: Maintain active topic understanding. Acknowledge context shifts.
15. DECISIVE ADVICE DIRECTIVE: If a clear best option exists, state: **“Here’s the smartest move I recommend based on your numbers and goals.”** Justify with 1–2 points. Offer 1 alternative if relevant. Use confident language.
---
MANDATORY OUTPUT RULES
- ALL math and financial formulas MUST be written in **LaTeX**.
- Use `$...$` for inline math and `$$...$$` for display math.
- Escape all dollar signs in LaTeX using `\\$`. Example: `\\$120,000`.
- Always define variables before or after formulas. Example: “Where $P$ is the principal...”
- Always include units in answers: $, %, days, months, years.
- Round all decimal values to two decimal places (e.g., $2,367.00).
- Include all major calculations as LaTeX steps inside the `structured_data_for_ui` object when appropriate.
- Use clear, concise language. Avoid jargon unless necessary.

CLARITY AND READABILITY IN RESPONSES:
- **Avoid Repetition:** Do not repeat phrases or sentences unnecessarily. Ensure your reasoning flows clearly without redundant statements.
- **Proper Spacing:** ALWAYS ensure there are spaces between words, numbers, and punctuation where appropriate. For example, write "$3,000 per month, while owning..." not "$3,000/month,whileowning...".
- **Sentence Structure:** Construct clear, grammatically correct sentences. When incorporating data or numbers, ensure they are integrated smoothly into the text with correct spacing and context.
- **Currency and Numbers:** Clearly format all currency values with a dollar sign and commas (e.g., $3,000.00, not 3,000). Ensure units like "/month" have a space before them if they follow a number.
- **Markdown Tables:** When presenting tabular data, use Markdown format for clarity. Ensure each column is clearly labeled and values are rounded to two decimal places with appropriate units.
- **Avoid Jargon:** Use simple, clear language. If technical terms are necessary, explain them briefly.
- **Avoid Overly Complex Sentences:** Keep sentences concise and to the point. Break down complex ideas into simpler components.
- **Use Bullet Points for Lists:** When listing items or steps, use bullet points or numbered lists for better readability.
- **Consistent Formatting:** Maintain consistent formatting throughout your responses, especially when dealing with numbers, dates, and financial terms.
- **Avoid Unnecessary Capitalization:** Use capitalization only where grammatically appropriate (e.g., at the start of sentences, for proper nouns). Do not capitalize words unnecessarily.
- **Avoid Unnecessary Symbols:** Do not use symbols like "@" or "#" unless they are part of a specific term or context (e.g., email addresses, hashtags). Use clear language instead.
- **Avoid Unnecessary Abbreviations:** Use full words instead of abbreviations unless they are widely recognized (e.g., "approximately" instead of "approx.").

### Recommendation Summary:
- **Best Option**: [Summarize recommended action]
- **Justification**: [Explain briefly based on Alex’s data and goals]
- **Alternative (if helpful)**: [List one reasonable alternative if relevant]
---
ERROR CORRECTION PROTOCOL
If you: Fail to base advice on data, omit units/rounding, ignore psych profile → Acknowledge and correct.
---
ALWAYS CHECK: Is this SQL-truth? Fits Alex’s values/goals? Empowers Alex?
---
PENNY’S MISSION: Your financial thinking partner — blending intelligence, strategy, emotional insight, and truth. Make every decision feel smarter, more peaceful, and more powerful for Alex Carter.
    """ # Ensure your full system prompt (from MVPGitLab526.py, response #58) is here
    
    if doc_insight_summary and "unavailable" not in doc_insight_summary.lower() and "failed" not in doc_insight_summary.lower() and "no specific insights" not in doc_insight_summary.lower() :
        system_message_content += f"\n\n---\n📚 Insights for Alex (Internal):\n{doc_insight_summary}\n"
        logger.info("Injected document summary into system prompt.")
    else:
        logger.warning(f"No substantive document insight summary for injection. Summary: '{doc_insight_summary}'")
        system_message_content += "\n\n---\n📚 No specific insights pre-extracted from documents or extraction failed.\n"
    
    system_message = SystemMessagePromptTemplate.from_template(system_message_content)
    prompt = ChatPromptTemplate.from_messages([
        system_message, 
        MessagesPlaceholder(variable_name="chat_history"), 
        HumanMessagePromptTemplate.from_template("{input}"), 
        MessagesPlaceholder(variable_name="agent_scratchpad")
    ])
    agent_runnable = create_openai_functions_agent(llm, tools_list, prompt)
    agent_executor = AgentExecutor(
        agent=agent_runnable, tools=tools_list, memory=memory, verbose=True, # Uses global memory
        handle_parsing_errors="TrueFi Agent: Slight issue processing that. Could you rephrase?",
        max_iterations=10, early_stopping_method="generate"
    )
    logger.info("Penny agent initialized with global memory and tools.")
    return agent_executor

# --- Global Agent Instance & Variables (Moved from MVPGitLab526.py) ---
# These are initialized when this module is imported.
penny_global_agent = initialize_penny_agent()
global_conversation_id_uuid = str(uuid.uuid4()) # For MVP logging continuity
global_turn_counter = 0

# --- Main processing function to be called by app.api ---
async def process_chat_message(session_id: str, user_query: str) -> Dict:
    """
    Handles an incoming chat message, processes it with Penny, and returns the response.
    Manages global turn counter and conversation ID for MVP logging.
    """
    global global_turn_counter # To modify the global counter

    logger.info(f"Agent Processing (Session: {session_id}, Turn: {global_turn_counter + 1}): '{user_query}'")
    global_turn_counter += 1

    processed_user_query = inject_context(user_query)
    if processed_user_query != user_query:
        logger.info("Context injected into user query for agent processing.")

    ai_response_text = "Sorry, I encountered an issue generating a response." # Default
    rich_content_output: Optional[Dict] = None # For structured data from tools

    try:
        response_from_agent = await penny_global_agent.ainvoke({"input": processed_user_query})
        
        # 'output' from the agent might be a string OR a dictionary from our new tool
        raw_agent_result = response_from_agent.get("output")

        logger.info(f"Type of raw_agent_result from agent: {type(raw_agent_result)}")
        logger.info(f"Value of raw_agent_result from agent: {raw_agent_result}")

        if isinstance(raw_agent_result, dict):
            # This handles the case where a tool (like get_asset_breakdown_tool) returns our structured dict
            ai_response_content_final_string = raw_agent_result.get("text_response", "No text response provided by tool.")
            structured_payload = raw_agent_result.get("structured_data_for_ui")
            if structured_payload and isinstance(structured_payload, dict):
                try:
                    # Validate and create the RichContentData object
                    rich_content_for_ui = RichContentData(
                        type=str(structured_payload.get("type")),
                        data=structured_payload.get("data"), # data will be passed as is
                        title=str(structured_payload.get("title")) if structured_payload.get("title") else None
                    )
                    logger.info(f"Extracted rich content: type='{rich_content_for_ui.type}', title='{rich_content_for_ui.title}'")
                except Exception as pydantic_error: # Catch potential Pydantic validation errors or others
                    logger.error(f"Error creating RichContentData object: {pydantic_error}", exc_info=True)
                    # Fallback to just using the text response if structuring fails
                    ai_response_content_final_string = str(raw_agent_result) # Or a more specific text part of raw_agent_result
                    rich_content_for_ui = None 
        elif isinstance(raw_agent_result, str):
            ai_response_content_final_string = raw_agent_result
        elif raw_agent_result is not None:
            ai_response_content_final_string = str(raw_agent_result)
            logger.warning(f"Agent output was an unexpected type, converted to string: {ai_response_content_final_string}")
        else:
            logger.warning("Agent output was None, using default error message.")
            
    except Exception as e:
        logger.error(f"Error during API agent invocation: {e}", exc_info=True)
        ai_response_content_final_string = "I'm sorry, there was an error processing your request with the AI."
        rich_content_for_ui = None # Ensure no rich content on error

    # Ensure a string is passed to logging functions
    # For logging, we only log the text part of the response.
    log_full_conversation_turn(global_conversation_id_uuid, global_turn_counter, user_query, ai_response_content_final_string)
    maybe_log_scenario(user_query, ai_response_content_final_string, global_conversation_id_uuid)
    
    return ChatResponse(
        reply=ai_response_content_final_string, 
        session_id=session_id,  # Use the function parameter
        rich_content=rich_content_for_ui
    )